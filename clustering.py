import os, sys

from __future__ import division
import re
import nltk
from nltk.corpus import stopwords
import time
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem.porter import PorterStemmer
from sklearn.neighbors import NearestNeighbors
import matplotlib.pyplot as plt


sys.path.append("..")
from documents import document_list


# NUM_CLUSTERS = 13
NUM_CLUSTERS = 20
K_MEANS_RANDOM_STATE = 20

# From tutorial https://beckernick.github.io/law-clustering/
raw_document_list = document_list.copy()

stemmer = PorterStemmer()


def stem_words(words_list, stemmer):
    return [stemmer.stem(word) for word in words_list]


def tokenize(text):
    tokens = nltk.word_tokenize(text)
    stems = stem_words(tokens, stemmer)
    return stems


def print_nearest_neighbors(query_tf_idf, document_list, knn_model, k):
    """
    Inputs: a query tf_idf vector, the dictionary of bills, the knn model, and the number of neighbors
    Prints the k nearest neighbors
    """
    distances, indices = knn_model.kneighbors(query_tf_idf, n_neighbors=k + 1)
    nearest_neighbors = [raw_document_list[x] for x in indices.flatten()]

    for p in range(len(nearest_neighbors)):
        if p == 0:
            print("Query Pensée: {0}\n".format(nearest_neighbors[p]))
        else:
            print("{0}: {1}\n".format(p, nearest_neighbors[p]))


def get_nearest_neighbors(query_tf_idf, document_list, knn_model, k):
    """
    Inputs: a query tf_idf vector, the dictionary of bills, the knn model, and the number of neighbors
    Prints the k nearest neighbors
    """
    distances, indices = knn_model.kneighbors(query_tf_idf, n_neighbors=k + 1)
    nearest_neighbors = [raw_document_list[x] for x in indices.flatten()]
    return nearest_neighbors


# Clean documents
def clean_doc(raw_doc):
    """
    Function to clean document text to keep only letters and remove stopwords
    Returns a string of the cleaned document text
    """
    letters_only = re.sub("[^a-zA-Z]", " ", raw_doc)
    words = letters_only.lower().split()
    stopwords_eng = set(stopwords.words("english"))
    useful_words = [x for x in words if not x in stopwords_eng]

    # Combine words into a paragraph again
    useful_words_string = " ".join(useful_words)
    return useful_words_string


for i, d in enumerate(document_list):
    document_list[i] = clean_doc(d)

# tfidf = TfidfVectorizer(min_df=1, stop_words="english")
tfidf = TfidfVectorizer(tokenizer=tokenize, stop_words="english")
# tfs should be a matrix, where each row represents a pensée and each column represents a token (word) in the corpus
# document, word matrix (words from all combined words in corpus, corpus = document collection)
tfs = tfidf.fit_transform(document_list)
print(tfs)
print(type(tfs))


# Nearest neighbor function
model_tf_idf = NearestNeighbors(metric="cosine", algorithm="brute")
model_tf_idf.fit(tfs)

p_id = 347
print_nearest_neighbors(tfs[p_id], document_list, model_tf_idf, k=5)

# Now k-means cluster
from sklearn.cluster import KMeans

for NUM_CLUSTERS in range(4, 15):
    for K_MEANS_RANDOM_STATE in range(5):
        cluster_path = os.path.jon(
            "kmeans_clusters",
            f"num_clusters_{NUM_CLUSTERS}_kmeans_random_state_{K_MEANS_RANDOM_STATE}",
        )
        if not os.path.exists(cluster_path):
            os.mkdir(cluster_path)

        k = NUM_CLUSTERS  # Tune this parameter through domain knowledge or some kind of ekbow fitting
        km = KMeans(
            n_clusters=k,
            init="k-means++",
            max_iter=100,
            n_init=5,
            verbose=1,
            random_state=K_MEANS_RANDOM_STATE,
        )
        km.fit(tfs)

        # SHOW cluster histogram

        plt.hist(km.labels_, bins=k)
        plt.savefig(
            os.path.join(
                cluster_path,
                f"HISTOGRAM num_clusters_{NUM_CLUSTERS}_kmeans_random_state_{K_MEANS_RANDOM_STATE}.png",
            )
        )
        # plt.show()

        cluster_assignments_dict = {}
        cluster_assignments_dict_raw = {}

        for i in set(km.labels_):
            current_cluster_p_raw = [
                raw_document_list[x] for x in np.where(km.labels_ == i)[0]
            ]
            current_cluster_p = [document_list[x] for x in np.where(km.labels_ == i)[0]]
            cluster_assignments_dict[i] = current_cluster_p
            cluster_assignments_dict_raw[i] = current_cluster_p_raw

        # print a few random clusters to see if make sense
        """
        cluster_pick = 4
        print('\n------------- Cluster {0}'.format(cluster_pick))
        for p in cluster_assignments_dict[cluster_pick]:
            print(p)
        cluster_pick = 1
        print('\n------------- Cluster {0}'.format(cluster_pick))
        for p in cluster_assignments_dict[cluster_pick]:
            print(p)
        """
        ## Determining Cluster Themes with TF-IDF
        cluster_themes_dict = {}

        for key in cluster_assignments_dict.keys():
            # current_tfidf = TfidfVectorizer(tokenizer=tokenize, stop_words='english')
            current_tfidf = TfidfVectorizer(stop_words="english")
            current_tfs = current_tfidf.fit_transform(cluster_assignments_dict[key])

            current_tf_idfs = dict(
                zip(current_tfidf.get_feature_names_out(), current_tfidf.idf_)
            )
            tf_idfs_tuples = current_tf_idfs.items()
            cluster_themes_dict[key] = sorted(tf_idfs_tuples, key=lambda x: x[1])[:5]

        # print(cluster_themes_dict)

        ## Write clusters to individual files

        for nc in range(len(cluster_themes_dict)):
            with open(
                os.path.join(cluster_path, f"cluster_{nc}_of_{NUM_CLUSTERS}"), "w"
            ) as f:
                print(
                    f"Cluster {nc} key words: {[x[0] for x in cluster_themes_dict[nc]]}"
                )
                print(
                    f"Cluster {nc} contains {len(cluster_assignments_dict[nc])} pensées"
                )

                f.write(
                    f"Cluster {nc} key words: {[x[0] for x in cluster_themes_dict[nc]]}\n"
                )
                f.write(
                    f"Cluster {nc} contains {len(cluster_assignments_dict[nc])} pensées\n"
                )
                f.write(
                    "\n-------------------------------------------------------------------------------\n"
                )
                for p in cluster_assignments_dict_raw[nc]:
                    f.write(p)
                    f.write("\n")
        f.close()

        # SHOW CLUSTER PLOT
        from sklearn.manifold import TSNE
        from sklearn.decomposition import TruncatedSVD

        k = NUM_CLUSTERS
        tfs_reduced = TruncatedSVD(n_components=k, random_state=0).fit_transform(tfs)
        tfs_embedded = TSNE(n_components=2, perplexity=40, verbose=2).fit_transform(
            tfs_reduced
        )
        fig = plt.figure(figsize=(10, 10))
        ax = plt.axes()
        plt.title(
            f"num_clusters_{NUM_CLUSTERS}_kmeans_random_state_{K_MEANS_RANDOM_STATE}"
        )
        plt.scatter(tfs_embedded[:, 0], tfs_embedded[:, 1], marker="x", c=km.labels_)
        plt.savefig(
            os.path.join(
                cluster_path,
                f"CLUSTER num_clusters_{NUM_CLUSTERS}_kmeans_random_state_{K_MEANS_RANDOM_STATE}.png",
            )
        )
        # plt.show()
