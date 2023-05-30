import sys
import pandas as pd
import numpy as np
from nltk.corpus import stopwords
from keras.preprocessing.text import Tokenizer
import re

# from keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.feature_extraction.text import TfidfVectorizer

sys.path.append("..")
from documents import document_list

# Clean documents df
documents_df = pd.DataFrame(document_list, columns=["documents"])
stop_words_l = stopwords.words("english")
documents_df["documents_cleaned"] = documents_df.documents.apply(
    lambda x: " ".join(
        re.sub(r"[^a-zA-Z]", " ", w).lower()
        for w in x.split()
        if re.sub(r"[^a-zA-Z]", " ", w).lower() not in stop_words_l
    )
)

tfidfvectoriser = TfidfVectorizer()
tfidfvectoriser.fit(documents_df.documents_cleaned)
tfidf_vectors = tfidfvectoriser.transform(documents_df.documents_cleaned)

tokenizer = Tokenizer()
tokenizer.fit_on_texts(documents_df.documents_cleaned)
tokenized_documents = tokenizer.texts_to_sequences(documents_df.documents_cleaned)
tokenized_paded_documents = pad_sequences(
    tokenized_documents, maxlen=64, padding="post"
)
vocab_size = len(tokenizer.word_index) + 1

# reading Glove word embeddings into a dictionary with "word" as key and values as word vectors
embeddings_index = dict()

with open("glove.6B/glove.6B.100d.txt") as file:
    for line in file:
        values = line.split()
        word = values[0]
        coefs = np.asarray(values[1:], dtype="float32")
        embeddings_index[word] = coefs

# creating embedding matrix, every row is a vector representation from the vocabulary indexed by the tokenizer index.
embedding_matrix = np.zeros((vocab_size, 100))

for word, i in tokenizer.word_index.items():
    embedding_vector = embeddings_index.get(word)
    if embedding_vector is not None:
        embedding_matrix[i] = embedding_vector

# calculating average of word vectors of a document weighted by tf-idf
document_embeddings = np.zeros((len(tokenized_paded_documents), 100))
words = tfidfvectoriser.get_feature_names_out()

# instead of creating document-word embeddings, directly creating document embeddings
for i in range(documents_df.shape[0]):
    for j in range(len(words)):
        document_embeddings[i] += (
            embedding_matrix[tokenizer.word_index[words[j]]] * tfidf_vectors[i][j]
        )


pairwise_similarities = cosine_similarity(document_embeddings)
pairwise_differences = euclidean_distances(document_embeddings)
