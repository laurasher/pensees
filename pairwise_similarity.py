import sys
import numpy as np
import seaborn as sns
import matplotlib.pylab as plt
from sklearn.feature_extraction.text import TfidfVectorizer

sys.path.append("..")
from documents import document_list

corpus = document_list
vect = TfidfVectorizer(min_df=1, stop_words="english")
tfidf = vect.fit_transform(corpus)
pairwise_similarity = tfidf * tfidf.T

print(pairwise_similarity)
sim_arr = pairwise_similarity.toarray()

np.fill_diagonal(sim_arr, np.nan)
print(sim_arr)
# ax = sns.heatmap(sim_arr, linewidth=0)
# plt.show()

print(np.amax(sim_arr))
mask = np.zeros_like(sim_arr)
mask[np.triu_indices_from(mask)] = True
with sns.axes_style("ticks"):
    ax = sns.heatmap(
        sim_arr,
        mask=mask,
        vmin=np.amin(sim_arr),
        vmax=np.amax(sim_arr),
        square=True,
        cmap="YlGnBu",
    )
    plt.show()

# Could organize by similarity... thematically
# Or offer chronolgical and similarity sorting options
