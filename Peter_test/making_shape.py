# -*- coding: utf-8 -*-
"""
Created on Sun May 07 19:34:22 2017

@author: U6128464
"""

import shapefile as shp
import csv

out_file = 'points.shp'

#Set up blank lists for data
x,y=[],[]

#read data from csv file and store in lists
with open('Lat_Lon.csv', 'rb') as csvfile:
    r = csv.reader(csvfile, delimiter=',')
    for i,row in enumerate(r):
        if i > 0: #skip header
            x.append(float(row[1]))
            y.append(float(row[2]))

#Set up shapefile writer and create empty fields
w = shp.Writer(shp.POINT)
w.autoBalance = 1 #ensures gemoetry and attributes match
w.field('X','F',10,8)
w.field('Y','F',10,8)

#loop through the data and write the shapefile
for j,k in enumerate(x):
    w.point(k,y[j]) #write the geometry

#Save shapefile
w.save(out_file)