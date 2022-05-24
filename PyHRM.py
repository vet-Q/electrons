
# coding: utf-8

# ## Introduction

# Please read a very nice introduction provided by Kapa BioSystems to understand, prepare and troubleshoot
# 
# http://www.kapabiosystems.com/document/introduction-high-resolution-melt-analysis-guide/
# 

# ### Import Python modules for analysis

# In[ ]:



import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


# ### Read and Plot Melting Data

# In[ ]:

df = pd.read_csv('melt_curve.csv')
plt.plot(df.iloc[:,0],df.iloc[:,1])
plt.show()


# ### Select melting range

# In[ ]:

df_melt=df.loc[(df.iloc[:,0]>75) & (df.iloc[:,0]<89)]
df_data=df_melt.iloc[:,1:]
plt.plot(df_melt.iloc[:,[0]],df_data)
plt.show()


# ### Normalizing 

# In[ ]:

df_norm= (df_data - df_data.min()) / (df_data.max()-df_data.min())*100
plt.plot(df_melt.iloc[:,[0]],df_norm)
plt.show()

# ### Melting temp

dfdt = df_norm.diff()
plt.plot(df_melt.iloc[:,[0]],dfdt)
plt.show()

dfdtWithTemp = pd.concat([df_melt.iloc[:,[0]],dfdt],axis=1)
meltTempList = dfdtWithTemp.set_index('Temperature').idxmin()

# ### Calculate and Show Diff Plot 

# In[ ]:

dfdif = df_norm.sub(df_norm['J14'],axis=0)
plt.plot(df_melt.iloc[:,[0]],dfdif)
plt.show()


# ### Clustering

# Use KMeans module from SciKit-Learn to cluster your sample into three groups (WT, KO, HET). Be careful, your samples may have less than three groups. So always check the diff plots first.

# In[ ]:

import sklearn.cluster as sc
from IPython.display import display


# In[ ]:

mat = dfdif.T.values
hc = sc.KMeans(n_clusters=3)
hc.fit(mat)

labels = hc.labels_
results = pd.DataFrame([dfdif.T.index,labels])
display(results.loc[:0,results.iloc[1]==0])
display(results.loc[:0,results.iloc[1]==1])
display(results.loc[:0,results.iloc[1]==2])


# My controls are 
# * WT: I12, J12
# * KO: I13, J13
# * HET: I14, J14
# 
# So you can identify your genotyping results by looking at: to which control they cluster.

# Ploting with plot.ly, so you can look at individual lines for better pattern recognition
# In[ ]:
import plotly.plotly as py
import cufflinks as cf
import plotly.graph_objs as go

cf.set_config_file(offline=False, world_readable=True, theme='ggplot')

dfpy = dfdif.set_index(df_melt.iloc[:,0])

# Plot and embed in ipython notebook!
dfpy.iplot(kind='scatter', filename='pyHRM')


