import sys
from math import pi
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

sys.path.append("..")
from documents import document_list

# --- Input params --- #
N = 10
key_document = 1
# -------------------- #

corpus = document_list
vect = TfidfVectorizer(min_df=1, stop_words="english")
tfidf = vect.fit_transform(corpus)
pairwise_similarity = tfidf * tfidf.T
# print(pairwise_similarity)
# print(type(pairwise_similarity))

sim_arr = pairwise_similarity.toarray()
np.fill_diagonal(sim_arr, np.nan)
# print(sim_arr)
# print(type(sim_arr))

sim_df = pd.DataFrame(sim_arr)
# print(sim_df)
# print(type(sim_df))


def get_most_n_similar(document_num=0, N=10):
    # Subset document df to input document column
    df = sim_df.loc[document_num]
    print(df)
    df_sorted = df.sort_values(ascending=False)
    print(df_sorted)
    top_n = df_sorted.head(N).index.to_list()
    print(df_sorted.head(N))
    print(top_n)
    return top_n


top_n = get_most_n_similar(key_document, N)

print(f"------- Pensee #{key_document} -------")
print(document_list[key_document])
for i in range(N):
    print(f"--- {i+1}th most similar pensee to pensee #{key_document}")
    print(document_list[i])
