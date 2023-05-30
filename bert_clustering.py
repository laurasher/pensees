import os
import pandas as pd
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer, util
from umap import UMAP
from hdbscan import HDBSCAN
from sklearn.feature_extraction.text import CountVectorizer
from bertopic.vectorizers import ClassTfidfTransformer
import numpy as np
import tensorflow
import tensorflow_hub as hub
from documents import document_list

docs = document_list

# -------------- #
# KNOBS
NUM_NEIGHBORS = 4  # original was 15. this affects the number of topics that result
# -------------- #


# Step 1 - Extract embeddings
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = embedding_model.encode(docs, show_progress_bar=False)
print("Step 1 - Extract embeddings")


for NUM_NEIGHBORS in range(2, 10):
    try:
        print(f"\n----------- NUM NEIGHBORS {NUM_NEIGHBORS} -----------")
        # Step 2 - Reduce dimensionality
        umap_model = UMAP(
            n_neighbors=NUM_NEIGHBORS, n_components=5, min_dist=0.0, metric="cosine"
        )
        print("Step 2 - Reduce dimensionality")

        # Step 3 - Cluster reduced embeddings
        hdbscan_model = HDBSCAN(
            min_cluster_size=15,
            metric="euclidean",
            cluster_selection_method="eom",
            prediction_data=True,
        )
        print("Step 3 - Cluster reduced embeddings")

        # Step 4 - Tokenize topics
        vectorizer_model = CountVectorizer(stop_words="english")
        print("Step 4 - Tokenize topics")

        # Step 5 - Create topic representation
        ctfidf_model = ClassTfidfTransformer()
        print("Step 5 - Create topic representation")

        # All steps together
        topic_model = BERTopic(
            embedding_model=embedding_model,  # Step 1 - Extract embeddings
            umap_model=umap_model,  # Step 2 - Reduce dimensionality
            hdbscan_model=hdbscan_model,  # Step 3 - Cluster reduced embeddings
            vectorizer_model=vectorizer_model,  # Step 4 - Tokenize topics
            ctfidf_model=ctfidf_model,  # Step 5 - Extract topic words
            calculate_probabilities=True,
            low_memory=True,
            verbose=True,
        )

        # load the universal sentence encoder model
        use4 = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

        df = pd.DataFrame(docs, columns=["description"])

        # generate embeddings
        use4_embeddings = use4(df["description"])
        use = np.array(use4_embeddings)

        # create list from np arrays to store the embeddings in the dataframe
        df["use4"] = use.tolist()

        # pass the embeddings into BERTopic
        topic_model.fit_transform(docs, use)

        # get topic info
        print(topic_model.get_topic_info())

        topics, probs = topic_model.fit_transform(docs)
        hierarchical_topics = topic_model.hierarchical_topics(docs)

        print(topic_model.get_topic_info())

        topic_docs = {topic: [] for topic in set(topics)}
        for topic, doc in zip(topics, docs):
            topic_docs[topic].append(doc)

        cluster_path = os.path.join("bert_clusters", f"num_topics_{len(topic_docs)-1}")
        if not os.path.exists(cluster_path):
            os.mkdir(cluster_path)

        for nc in range(len(topic_docs) - 1):
            with open(
                os.path.join(cluster_path, f"topic_{nc}_of_{len(topic_docs)-1}"), "w"
            ) as f:
                topic_info_df = topic_model.get_topic_info()
                _info = topic_info_df[topic_info_df["Topic"] == nc]
                print(f'Cluster {nc} key words: {_info["Name"].values[0]}')
                print(f'Cluster {nc} contains {_info["Count"].values[0]} pensées')

                f.write(f'Cluster {nc} key words: {_info["Name"].values[0]}\n')
                f.write(f'Cluster {nc} contains {_info["Count"].values[0]} pensées\n')
                f.write(
                    "\n-------------------------------------------------------------------------------\n"
                )
                for p in topic_docs[nc]:
                    f.write(p)
                    f.write("\n")
        f.close()

        fig1 = topic_model.visualize_topics()
        fig1.update_layout(
            title=f"Topic Distances {len(topic_docs)-1} clusters, NUM_NEIGHBORS {NUM_NEIGHBORS}"
        )
        fig1.write_html(
            os.path.join(
                cluster_path,
                f"topic_clusters_distance_num_topics_{len(topic_docs)-1}.html",
            )
        )
        # fig1.show()

        fig2 = topic_model.visualize_barchart(top_n_topics=len(topic_docs) - 1)
        fig2.write_html(
            os.path.join(
                cluster_path,
                f"topic_barchart_wordscores_num_topics_{len(topic_docs)-1}.html",
            )
        )
        fig2.write_image(
            os.path.join(
                cluster_path,
                f"topic_barchart_wordscores_num_topics_{len(topic_docs)-1}.png",
            )
        )
        # fig2.show()

        # Run the visualization with the original embeddings
        fig3 = topic_model.visualize_documents(docs, embeddings=embeddings)
        fig3.update_layout(
            title=f"Clusters with original embeddings {len(topic_docs)-1} clusters, NUM_NEIGHBORS {NUM_NEIGHBORS}"
        )
        fig3.write_html(
            os.path.join(
                cluster_path,
                f"topic_clusters_original_embeddings_num_topics_{len(topic_docs)-1}.html",
            )
        )
        fig3.write_image(
            os.path.join(
                cluster_path,
                f"topic_clusters_original_embeddings_num_topics_{len(topic_docs)-1}.png",
            )
        )
        # fig3.show()

        # Reduce dimensionality of embeddings, this step is optional but much faster to perform iteratively:
        reduced_embeddings = umap_model.fit_transform(embeddings)
        fig4 = topic_model.visualize_documents(
            docs, reduced_embeddings=reduced_embeddings
        )
        fig4.update_layout(
            title=f"Clusters with UMAP reduced embeddings {len(topic_docs)-1} clusters, NUM_NEIGHBORS {NUM_NEIGHBORS}"
        )
        fig4.write_html(
            os.path.join(
                cluster_path,
                f"topic_clusters_UMAP_reduced_embeddings_num_topics_{len(topic_docs)-1}.html",
            )
        )
        # fig4.show()

        tree = topic_model.get_topic_tree(hierarchical_topics)
        print(tree)
    except Exception as e:
        print(f"X ----------- ERROR NUM NEIGHBORS {NUM_NEIGHBORS} -----------")
        print(f"{e}")
