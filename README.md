<p align="center"><img  width=100 src="/public/img/loading.gif"/></p>
<h1 align="center"> CULTURE WITHOUT BORDERS </h1>
<br>

> “I think there is no culture in which music is not very important and central. That’s why I think of us as a sort of musical species.” — Oliver Sacks

> "You don't have to burn books to destroy a culture. Just get people to stop reading them." - Ray Bradbury

#### Author: [Guilherme Eisfeld](http:/github.com/campodegelo) 🍅

#### Content:

1. [Description](#Description)
2. [Technologies](#Technologies)
3. [Features](#Features)
   <br>3.1. [World Map](#1)
   <br>3.2. [Country Information](#2)
   <br>3.3. [Literature](#3)
   <br>3.4. [Music](#4)
   <br>3.5. [Search Literature](#5)
   <br>3.6. [Search Music](#6)
4. [Next Features](#Next)

---

### 1. Description <a name="Description"></a>

A cultural and collaborative platform, where users are able to insert and search literature and music from and to a specific Country.
Users are allowed to navigate on the map, and click on the countries, showing the latest information inserted about music or literature.

### 2. Technologies <a name="Technologies"></a>

- Axios
- CSS
- Deezer API
- GoodReads API
- HTML
- MapBox
- Node.js
- PostgreSQL
- React

## 3. Features <a name="Features"></a>

#### 3.1 World Map <a name="1"></a>

<br>

<p align="center"><img src="/public/gif/map.gif" width="100%"/></p>

Combining the features of MapBox and its Studios, with a huge GeoJSON file with all coordinates for each specific country, it was possible to create a hover effect showing the area of a country, which can be clicked, in order to show more information.

#### 3.2 Country Information <a name="2"></a>

<br>

<p align="center"><img src="/public/gif/country.gif" width="100%"/></p>

A small popup showing the latest 5 Authors and 5 Artists inserted in the database.
Every component is dinamically assigned, that's why it is possible to show the flag and names.
If you want more information about Literature or Music, click on the specific buttoms.

#### 3.3 Literature <a name="3"></a>

<br>

<p align="center"><img src="/public/gif/literature.gif" width="100%"/></p>

Each country will have dinamically its page, with the country flag as the background image and the inserted Authors and Books related to this nationality.

#### 3.4 Music <a name="4"></a>

<br>

<p align="center"><img src="/public/gif/music.gif" width="100%"/></p>

Each country will have dinamically its page, with the country flag as the background image and the inserted Artists and Albums related to this nationality.

#### 3.5 Search Literature <a name="5"></a>

<br>

<p align="center"><img src="/public/gif/search-literature.gif" width="100%"/></p>

Choose between an Author or a Book in the checkbox, type the name you want and click on SEARCH.
Behind the scenes, the GoodReads API will be verified and will return the results matching the chosen input.
Afterwards select the ones you want, the country they belong to, and click on ADD ITEM. They will be inserted in the Country's Database.

#### 3.6 Search Music <a name="6"></a>

<br>

<p align="center"><img src="/public/gif/search-music.gif" width="100%"/></p>

Choose between an Artist or an Album in the checkbox, type the name you want and click on SEARCH.
Behind the scenes, the Deezer API will be verified and will return the results matching the chosen input.
Afterwards select the ones you want, the country they belong to, and click on ADD ITEM.
They will be inserted in the Country's Database.

### 4. Next Features <a name="Next"></a>

As the platform relies on user inputs, errors may arise.
An author can be inserted as being German, but actually he/she was born in Austria.
What to do then?
Some ways to approach this will be taken.
As inserting ERROR buttoms to report something wrong, or doing a previous verification before it is actually inserted in the database.
New updates soon.

---

This project started back in 2013, when living in India I noticed that everything I listened to was unknown to most of my colleagues and friends there. At the same point I had no idea about the rythms and artists they were enjoying.
Culture Without Borders, a social and collaborative platform to bring cultures closer and expose all of us to different approaches and ideas.
