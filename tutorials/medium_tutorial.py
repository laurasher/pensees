# Tutorial link
# https://medium.com/mlearning-ai/text-clustering-with-tf-idf-in-python-c94cd26a31e7
import os, sys

# import the dataset from sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# import other required libs
import pandas as pd
import numpy as np

# string manipulation libs
import re
import string
import nltk
from nltk.corpus import stopwords

# viz libs
import matplotlib.pyplot as plt
import seaborn as sns
import spectra

sys.path.append("..")
from documents import document_list

PRELOAD_DF = True
NUM_CLUSTERS = 10

def preprocess_text(text: str, remove_stopwords: bool) -> str:
    """This utility function sanitizes a string by:
    - removing links
    - removing special characters
    - removing numbers
    - removing stopwords
    - transforming in lowercase
    - removing excessive whitespaces
    Args:
        text (str): the input text you want to clean
        remove_stopwords (bool): whether or not to remove stopwords
    Returns:
        str: the cleaned text
    """

    # remove links
    text = re.sub(r"http\S+", "", text)
    # remove special chars and numbers
    text = re.sub("[^A-Za-z]+", " ", text)
    # remove stopwords
    if remove_stopwords:
        # 1. tokenize
        tokens = nltk.word_tokenize(text)
        # 2. check if stopword
        tokens = [w for w in tokens if not w.lower() in stopwords.words("english")]
        # 3. join back together
        text = " ".join(tokens)
    # return text in lower case and stripped of whitespaces
    text = text.lower().strip()
    return text

def get_top_keywords(n_terms):
    """This function returns the keywords for each centroid of the KMeans"""
    df = pd.DataFrame(X.todense()).groupby(clusters).mean() # groups the TF-IDF vector by cluster
    terms = vectorizer.get_feature_names_out() # access tf-idf terms
    for i,r in df.iterrows():
        print('\nCluster {}'.format(i))
        print(','.join([terms[t] for t in np.argsort(r)[-n_terms:]])) # for each row of the dataframe, find the n terms that have the highest tf idf score
            

if not PRELOAD_DF:
    df = pd.DataFrame(document_list, columns=["corpus"])
    df["number"] = df.corpus.apply(lambda x: int(x.split(".")[0]))
    df = df.set_index("number").sort_index()
    print(df)

    df['cleaned'] = df['corpus'].apply(lambda x: preprocess_text(x, remove_stopwords=True))
    print(df)
    df.to_pickle("./cleaned_docs_df.pkl")

else:
    df = pd.read_pickle("./cleaned_docs_df.pkl")

# initialize the vectorizer
vectorizer = TfidfVectorizer(sublinear_tf=True, min_df=5, max_df=0.95)
# fit_transform applies TF-IDF to clean texts - we save the array of vectors in X
X = vectorizer.fit_transform(df['cleaned'])

#X is the array of vectors that will be used to train the KMeans model
from sklearn.cluster import KMeans

# initialize kmeans with 3 centroids
kmeans = KMeans(n_clusters=NUM_CLUSTERS, random_state=42)
# fit the model
kmeans.fit(X)
# store cluster labels in a variable
clusters = kmeans.labels_

from sklearn.decomposition import PCA

# initialize PCA with 2 components
pca = PCA(n_components=2, random_state=42)
# pass our X to the pca and store the reduced vectors into pca_vecs
pca_vecs = pca.fit_transform(X.toarray())
# save our two dimensions into x0 and x1
x0 = pca_vecs[:, 0]
x1 = pca_vecs[:, 1]

# assign clusters and pca vectors to our dataframe 
df['cluster'] = clusters
df['x0'] = x0
df['x1'] = x1

print(df)
get_top_keywords(10)

print(df["cluster"].value_counts())

# map clusters to appropriate labels 
cluster_map = {}
cluster_colors = {}
# create color scale
color_scale = spectra.scale([ "blue", "red" ])
color_range = color_scale.range(NUM_CLUSTERS)

for i in range(NUM_CLUSTERS):
    cluster_map[i] = f"cluster {i}"
    cluster_colors[i] = color_range[i].hexcode
    
# apply mapping
df['cluster'] = df['cluster'].map(cluster_map)

# set image size
plt.figure(figsize=(12, 7))
# set a title
plt.title(f"TF-IDF + KMeans Num clusteres {NUM_CLUSTERS}", fontdict={"fontsize": 18})
# set axes names
plt.xlabel("X0", fontdict={"fontsize": 16})
plt.ylabel("X1", fontdict={"fontsize": 16})
# create scatter plot with seaborn, where hue is the class used to group the data
sns.scatterplot(data=df, x='x0', y='x1', hue='cluster', palette="tab10", size=2)
plt.show()