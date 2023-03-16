import sys
from math import pi
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pylab as plt
from sklearn.feature_extraction.text import TfidfVectorizer

sys.path.append("..")
from documents import document_list

# from bokeh.models import BasicTicker, ColorBar, LinearColorMapper, PrintfTickFormatter
# from bokeh.plotting import figure, show


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
# mask = np.zeros_like(sim_arr)
# mask[np.triu_indices_from(mask)] = True
# with sns.axes_style("ticks"):
#     ax = sns.heatmap(
#         sim_arr,
#         mask=mask,
#         vmin=np.amin(sim_arr),
#         vmax=np.amax(sim_arr),
#         square=True,
#         cmap="magma_r",
#     )
#     plt.show()

# Could organize by similarity... thematically
# Or offer chronolgical and similarity sorting options

df = pd.DataFrame(sim_arr)
mask = pd.DataFrame(np.triu(np.ones(df.shape)).astype(bool))
df[mask] = 0
import plotly.express as px

fig = px.imshow(df, color_continuous_scale="hot")
fig.show()
# print(df)

# years = list(data.index)
# months = list(data.columns)

# # reshape to 1D array or rates with a month and year for each row.
# df = pd.DataFrame(data.stack(), columns=['rate']).reset_index()

# # this is the colormap from the original NYTimes plot
# colors = ["#75968f", "#a5bab7", "#c9d9d3", "#e2e2e2", "#dfccce", "#ddb7b1", "#cc7878", "#933b41", "#550b1d"]
# mapper = LinearColorMapper(palette=colors, low=np.amin(sim_arr), high=np.amax(sim_arr))

# TOOLS = "hover,save,pan,box_zoom,reset,wheel_zoom"

# p = figure(title="",
#        #     x_range=years, y_range=list(reversed(months)),
#            x_axis_location="above", width=900, height=400,
#            tools=TOOLS, toolbar_location='below',
#        #     tooltips=[('date', '@Month @Year'), ('rate', '@rate%')]
#            )

# p.grid.grid_line_color = None
# p.axis.axis_line_color = None
# p.axis.major_tick_line_color = None
# p.axis.major_label_text_font_size = "7px"
# p.axis.major_label_standoff = 0
# p.xaxis.major_label_orientation = pi / 3

# p.rect(x="Year", y="Month", width=1, height=1,
#        source=df,
#        fill_color={'field': 'rate', 'transform': mapper},
#        line_color=None)

# color_bar = ColorBar(color_mapper=mapper, major_label_text_font_size="7px",
#                      ticker=BasicTicker(desired_num_ticks=len(colors)),
#                      formatter=PrintfTickFormatter(format="%d%%"),
#                      label_standoff=6, border_line_color=None)
# p.add_layout(color_bar, 'right')

# show(p)

# "187. Order.—Men despise religion; they hate it and fear it is true. To remedy this, we must begin by showing that religion is not contrary to reason; that it is venerable, to inspire respect for it; then we must make it lovable, to make good men hope it is true; finally, we must prove it is true.\n\nVenerable, because it has perfect knowledge of man; lovable because it promises the true good.\n",
# "442. Man's true nature, his true good, true virtue, and true religion, are things of which the knowledge is inseparable.\n",
