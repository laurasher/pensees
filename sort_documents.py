import sys
from math import pi
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

sys.path.append("..")
from documents import document_list

# --- Input params --- #
N = 2
key_document = 5
key_document_ind = key_document - 1
# -------------------- #

corpus = document_list
cleaned_corpus = []
# Remove numbers from documents before tfidf. Numbers shouldn't be involved in similarity measure
# This doesn't seem to yield as good results
# for c in corpus:
#     cleaned_corpus.append(c.split('. ')[1])

vect = TfidfVectorizer(min_df=1, stop_words="english")
tfidf = vect.fit_transform(corpus)
# tfidf = vect.fit_transform(cleaned_corpus)
pairwise_similarity = tfidf * tfidf.T
print("\nFeatures are all words in the corpus")
print(f"{vect.get_feature_names_out()}\n")

sim_arr = pairwise_similarity.toarray()
np.fill_diagonal(sim_arr, np.nan)
sim_df = pd.DataFrame(sim_arr)


def get_most_n_similar(document_num=0, N=10):
    # Want to be able to refer to Pensee's by number, but the list is 0-indexed
    document_num = document_num - 1
    # Subset document df to input document column
    df = sim_df.loc[document_num]
    df_sorted = df.sort_values(ascending=False)
    top_n = df_sorted.head(N).index.to_list()
    print(df_sorted.head(N))
    print(top_n)
    return top_n


top_n = get_most_n_similar(key_document, N)

print(f"\n\n------- Pensee #{key_document} -------")
print(document_list[key_document_ind])
for ind, i in enumerate(top_n):
    print(f"--- Top {ind+1} most similar to pensee #{key_document}")
    print(document_list[i])
