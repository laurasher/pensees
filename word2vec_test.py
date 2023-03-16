import sys
sys.path.append("..")
from documents import document_list

import gensim
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize
from gensim.models.doc2vec import Doc2Vec

SAVE_RETRAIN = False

data = document_list

if SAVE_RETRAIN:
    # Tag the data
    tagged_data = [TaggedDocument(words=word_tokenize(_d.lower()), tags=[str(i)]) for i, _d in enumerate(data)]

    # Initialize doc2vec
    model = gensim.models.doc2vec.Doc2Vec(vector_size=30, min_count=2, epochs=80)

    # Build model vocabulary
    model.build_vocab(tagged_data)

    # Train and save the model
    model.train(tagged_data, total_examples=model.corpus_count, epochs=80)
    model.save("d2v_pensee.model")

    # Quick test
    similar_doc = model.docvecs.most_similar('0')
    print(similar_doc[0])

else:
    N = 10
    key_document = 347
    key_document_ind = key_document-1

    # Load the model
    model = Doc2Vec.load("d2v_pensee.model")
    similar_doc = model.docvecs.most_similar(str(key_document_ind))
    print(f"\n----------------------------------Comparing to---------------------------------------------------")
    print(document_list[key_document_ind])
    for i in range(N):
        print(f"\n------- {i+1}")
        print(similar_doc[i])
        sim_ind = int(similar_doc[i][0])
        print(document_list[sim_ind])
