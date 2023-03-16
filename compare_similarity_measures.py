import sys
import pandas as pd
import numpy as np
from nltk.corpus import stopwords
import nltk
nltk.download('stopwords')
import re
from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import euclidean_distances

# Sample corpus
sys.path.append("..")
from documents import document_list

'''
Using TFIDF vectors for the words, compare Cosine Similary and Euclidean Distance
'''

documents_df=pd.DataFrame(document_list,columns=['documents'])

# removing special characters and stop words from the text
stop_words_l=stopwords.words('english')
documents_df['documents_cleaned']=documents_df.documents.apply(lambda x: " ".join(re.sub(r'[^a-zA-Z]',' ',w).lower() for w in x.split() if re.sub(r'[^a-zA-Z]',' ',w).lower() not in stop_words_l) )

tfidfvectoriser=TfidfVectorizer()
tfidfvectoriser.fit(documents_df.documents_cleaned)
tfidf_vectors=tfidfvectoriser.transform(documents_df.documents_cleaned)

pairwise_similarities=np.dot(tfidf_vectors,tfidf_vectors.T).toarray()
pairwise_differences=euclidean_distances(tfidf_vectors)

def most_similar(doc_id,similarity_matrix,matrix,top_N):
    if matrix=='Cosine Similarity':
        print('----- Similar Documents, Cosine Similarity:')
        similar_ix=np.argsort(similarity_matrix[doc_id])[::-1]
    elif matrix=='Euclidean Distance':
        print('----- Similar Documents, Euclidean Distance:')
        similar_ix=np.argsort(similarity_matrix[doc_id])
    count = 0
    for ix in similar_ix:
        if ix==doc_id:
            continue
        # print('\n')
        print (f'{documents_df.iloc[ix]["documents"]}')
        # print (f'{matrix} : {similarity_matrix[doc_id][ix]}')
        count = count+1
        if count > top_N:
            return

print("\n\n----------------------------------------------------------------------------------------------")
doc_id = 1
top_N = 3
print (f'Document: {documents_df.iloc[doc_id]["documents"]}')
most_similar(doc_id, pairwise_similarities, 'Cosine Similarity', top_N)
most_similar(doc_id, pairwise_differences, 'Euclidean Distance', top_N) 