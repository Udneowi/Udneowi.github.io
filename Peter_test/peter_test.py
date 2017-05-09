# -*- coding: utf-8 -*-
"""
Created on Sun May 07 18:33:25 2017

@author: U6128464  -73.92826,4073951
"""
#%%
import geopandas
import pandas as pd
from shapely.geometry import Point
df = pd.read_csv('./Lat_Lon.csv', low_memory=False)
geometry = [Point(xy) for xy in zip(df.LONGITUDE, df.LATITUDE)]
df = df.drop(['LONGITUDE', 'LATITUDE'], axis=1)
crs = {'init': 'epsg:4326'}

#%%
points = geopandas.GeoDataFrame(df, crs=crs, geometry=geometry)
poly  = geopandas.GeoDataFrame.from_file('ntasWPop.shp')

#%%

test = points.iloc[0]
test.crs = {'init': 'epsg:4326'}


#%%
from geopandas.tools import sjoin
pointInPolys = sjoin(points, poly, how='left')
grouped = pointInPolys.groupby('index_right')
list(grouped)

#%%

data = list(grouped)
liste = []
for i in range(len(data)):
    liste.append([str(data[i][1].NTAName.iloc[0]),len(data[i][1].NTAName)])
    