from __future__ import print_function
import numpy as np
import pandas as pd
import nltk
import re
import sys, os
import codecs
from sklearn import feature_extraction
import mpld3
import spectra

sys.path.append("..")
from documents import document_list

# load nltk's English stopwords as variable called 'stopwords'
stopwords = nltk.corpus.stopwords.words("english")

# Tutorial link
# http://brandonrose.org/clustering#K-means-clustering

NUM_CLUSTERS = 15
N_TOP_WORDS_PER_CLUSTER = 6

docs = document_list


def clean_doc(raw_doc):
    """
    Function to clean document text to keep only letters and remove stopwords
    Returns a string of the cleaned document text
    """
    letters_only = re.sub("[^a-zA-Z]", " ", raw_doc)
    words = letters_only.lower().split()
    stopwords_eng = stopwords
    useful_words = [x for x in words if not x in stopwords_eng]

    # Combine words into a paragraph again
    useful_words_string = " ".join(useful_words)
    return useful_words_string


doc_numbers = []

for i, d in enumerate(docs):
    doc_numbers.append(d.split(".")[0])

for i, d in enumerate(document_list):
    docs[i] = clean_doc(d)

# load nltk's SnowballStemmer as variabled 'stemmer'
from nltk.stem.snowball import SnowballStemmer

stemmer = SnowballStemmer("english")

# here I define a tokenizer and stemmer which returns the set of stems in the text that it is passed
def tokenize_and_stem(text):
    # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
    tokens = [
        word for sent in nltk.sent_tokenize(text) for word in nltk.word_tokenize(sent)
    ]
    filtered_tokens = []
    # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
    for token in tokens:
        if re.search("[a-zA-Z]", token):
            filtered_tokens.append(token)
    stems = [stemmer.stem(t) for t in filtered_tokens]
    return stems


def tokenize_only(text):
    # first tokenize by sentence, then by word to ensure that punctuation is caught as it's own token
    tokens = [
        word.lower()
        for sent in nltk.sent_tokenize(text)
        for word in nltk.word_tokenize(sent)
    ]
    filtered_tokens = []
    # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
    for token in tokens:
        if re.search("[a-zA-Z]", token):
            filtered_tokens.append(token)
    return filtered_tokens


# not super pythonic, no, not at all.
# use extend so it's a big flat list of vocab
totalvocab_stemmed = []
totalvocab_tokenized = []
for i in docs:
    allwords_stemmed = tokenize_and_stem(
        i
    )  # for each item in 'synopses', tokenize/stem
    totalvocab_stemmed.extend(allwords_stemmed)  # extend the 'totalvocab_stemmed' list

    allwords_tokenized = tokenize_only(i)
    totalvocab_tokenized.extend(allwords_tokenized)

vocab_frame = pd.DataFrame({"words": totalvocab_tokenized}, index=totalvocab_stemmed)
print("--- Vocab frame ---")
print(vocab_frame.head(20))
print(f"there are {str(vocab_frame.shape[0])} items in vocab_frame\n")


from sklearn.feature_extraction.text import TfidfVectorizer

# define vectorizer parameters
# tfidf_vectorizer = TfidfVectorizer(
#     max_df=0.8,
#     max_features=200000,
#     min_df=0.2,
#     stop_words="english",
#     use_idf=True,
#     tokenizer=tokenize_and_stem,
#     ngram_range=(1, 3),
# )
tfidf_vectorizer = TfidfVectorizer(
    # max_df=0.8,
    max_features=200000,
    # min_df=0.2,
    stop_words="english",
    use_idf=True,
    tokenizer=tokenize_and_stem,
    ngram_range=(1, 3),
)

tfidf_matrix = tfidf_vectorizer.fit_transform(docs)  # fit the vectorizer to synopses
print("--- tfidf matrix shape ---")
print(tfidf_matrix.shape)
terms = tfidf_vectorizer.get_feature_names_out()
print()

print("--- terms (features) ---")
print(terms)
print()

from sklearn.metrics.pairwise import cosine_similarity

dist = 1 - cosine_similarity(tfidf_matrix)

from sklearn.cluster import KMeans

km = KMeans(n_clusters=NUM_CLUSTERS)
km.fit(tfidf_matrix)
clusters = km.labels_.tolist()

import joblib

joblib.dump(km, "doc_cluster.pkl")
# km = joblib.load("doc_cluster.pkl")
clusters = km.labels_.tolist()
fragments = {
    "fragment_number": doc_numbers,
    "fragments": docs,
    "cluster": clusters,
}
frame = pd.DataFrame(
    fragments, index=[clusters], columns=["fragment_number", "fragments", "cluster"]
)
print("--- cluster dataframe ---")
print(frame)
print()

print("--- cluster count ---")
print(frame["cluster"].value_counts())  # number of fragments per cluster
print()

# Here is some fancy indexing and sorting on each cluster to identify which are the top n (I chose n=6)
# words that are nearest to the cluster centroid. This gives a good sense of the main topic of the cluster.
"""
print("--- Top terms per cluster ---")
print()

# sort cluster centers by proximity to centroid
order_centroids = km.cluster_centers_.argsort()[:, ::-1]
print(km.cluster_centers_)
print(order_centroids)

for i in range(NUM_CLUSTERS):
    # print(f"Cluster {i} words:")
    print(order_centroids[i, :N_TOP_WORDS_PER_CLUSTER])
    for ind in order_centroids[i, :N_TOP_WORDS_PER_CLUSTER]:
        # print(terms[ind])
        print(ind)
"""


import matplotlib.pyplot as plt
import matplotlib as mpl

from sklearn.manifold import MDS

MDS()

# convert two components as we're plotting points in a two-dimensional plane
# "precomputed" because we provide a distance matrix
# we will also specify `random_state` so the plot is reproducible.
mds = MDS(n_components=2, dissimilarity="precomputed", random_state=1)

pos = mds.fit_transform(dist)  # shape (n_components, n_samples)

xs, ys = pos[:, 0], pos[:, 1]

# create color scale
color_scale = spectra.scale(["blue", "red"])
color_range = color_scale.range(NUM_CLUSTERS)


# set up cluster names using a dict
cluster_names = {}
cluster_colors = {}

for i in clusters:
    cluster_names[i] = f"cluster {i}"
    cluster_colors[i] = color_range[i].hexcode

# create data frame that has the result of the MDS plus the cluster numbers and titles
df = pd.DataFrame(dict(x=xs, y=ys, label=clusters, fragment_number=doc_numbers))

# group by cluster
groups = df.groupby("label")


# set up plot
fig, ax = plt.subplots(figsize=(17, 9))  # set size
ax.margins(0.05)  # Optional, just adds 5% padding to the autoscaling

# iterate through groups to layer the plot
# note that I use the cluster_name and cluster_color dicts with the 'name' lookup to return the appropriate color/label
for name, group in groups:
    ax.plot(
        group.x,
        group.y,
        marker="o",
        linestyle="",
        ms=5,
        label=cluster_names[name],
        color=cluster_colors[name],
        mec="none",
    )
    ax.set_aspect("auto")
    ax.tick_params(
        axis="x",  # changes apply to the x-axis
        which="both",  # both major and minor ticks are affected
        bottom="off",  # ticks along the bottom edge are off
        top="off",  # ticks along the top edge are off
        labelbottom="off",
    )
    ax.tick_params(
        axis="y",  # changes apply to the y-axis
        which="both",  # both major and minor ticks are affected
        left="off",  # ticks along the bottom edge are off
        top="off",  # ticks along the top edge are off
        labelleft="off",
    )

ax.legend(numpoints=1)  # show legend with only 1 point

# add label in x,y position with the label as the film title
for i in range(len(df)):
    ax.text(df.iloc[i]["x"], df.iloc[i]["y"], df.iloc[i]["fragment_number"], size=8)


plt.show()  # show the plot

# uncomment the below to save the plot if need be
# plt.savefig('clusters_small_noaxes.png', dpi=200)
