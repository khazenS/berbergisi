# How to Setup
- First of all, you need to download Node.js and have a MongoDB account for database
- You should have your own database url to look like that but replace <db_password> with the password for the admin database user:
```sh
mongodb+srv://admin:<db_password>@cluster0.qdped.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
- After download all files in github repo , we need to download our dependencies
```sh
cd ui
npm i
```
```sh
cd server
npm i
```
- Now change the enviorement settings

![image](https://github.com/user-attachments/assets/343b56b5-3c18-4a3e-98c9-208b1ce6be0f)

 Change database URL with MongoDB url.PORT for empty port for server.JWT_SECRET and JWT_SECRET_QUE are passwords a kind of token. ENCRYPTION_DECRYPTION_KEY for crypro password which is matching ui server ENCRYPTION_DECRYPTION_KEY 

 ![image](https://github.com/user-attachments/assets/5cecce4c-917d-4345-8ef7-d71d76f254d5)

 REACT_APP_ENCRYPTION_DECRYPTION_KEY is matching with server ENCRYPTION_DECRYPTION_KEY as a same password then have a REACT_APP_SERVER_URL variable as server url and  plus '/api/'

 - Now lets start the project with
 
UI ;
```sh
npm start
```
SERVER ;
```sh
npm run start
```


# What is this app?
This app solves queue problem in real life. Some business may have a lot of customer and they reach to business with call there is no time for that because some days workers have to work hard.
Of course this app solves a lot of things like a  transparent looks of queue , some costumers care about open and transparent queue line.They want to see their name in a queue.
Actually this app provide features for business owner. Closing shop whenever wants , manipulating the queue line , call costumer as fast , add new user to lin as fast , raise the price of services and discount the price of services for data storage 
