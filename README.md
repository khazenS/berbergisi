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

- Before initialize , we have just last thing that is adding Shop and Admin database as a manually. I did not do register page or put a if block for generating Shop and Admin database collection because we need that just once and i  dont want to occupy the any place so lets enter the MongeDB and create a database as name of 'barberDatabase' and then create collections have name of 'Shop' and 'Admin' then insert a document for both;

```sh
username : 'admin' (String)
password: 'admin' (String)
adminAccessToken : null (String)
```
> !Note : if you want you can assign different username and password

```sh
shopID : 1 (Number)
shopStatus : false (Boolean)
cutPrice : 200 (Number)
cutBPrice : 250 (Number)
showMessage : null
```
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
Actually this app provide features for business owner. Closing shop whenever wants , manipulating the queue line , call costumer as fast , add new user to lin as fast , raise the price of services and discount the price of services for data storage.Of course, this app keep a lot of data for business owner for example daily-weekly-monthly-yearly income, how many cut finished as daily and weekly. Last important this  is that i used socket for this project so processes works as a asynchronous for all devices.

# How is it looks?

### Main Page
- When shop owner opened the day queue
  <br><br><br>
![image](https://github.com/user-attachments/assets/6db8ebc9-a8b1-4850-86c5-0a46255f2c7f)
![image](https://github.com/user-attachments/assets/0ca8b4d0-1d05-4f17-9f63-af3259ef2897)
 <br><br><br>
- When shop owner closed the day queue
  <br><br><br>
![image](https://github.com/user-attachments/assets/d58aab27-9620-4a67-bb23-b7320b9eb7f6)
 <br><br><br>

 ### Admin Page

 - First go 'http://localhost:3000/admin' page for login the admin page. If you have valid admin token for entry you will access the admin page , you dont have you will navigate to 'http://localhost:3000/adminLogin' automatically and you need to write your username and password.

   adminLogin page ;

   ![image](https://github.com/user-attachments/assets/43c4db77-3276-4e80-a4ba-dba276a70aae)

<br><br><br>

- This is looking of admin panel

![image](https://github.com/user-attachments/assets/b7500320-ba2e-433f-8bb4-868565748068)
![image](https://github.com/user-attachments/assets/c429e7fa-0aaf-494c-a9d8-c365d2db04c3)


# Features of admin panel

- You can close and open your shop for costumer entry. 

![image](https://github.com/user-attachments/assets/0c96ea84-44ad-4789-93e2-e61fdbb4cf46)
![image](https://github.com/user-attachments/assets/af07a435-2f02-4005-81b2-942c77fb8a41)

- If shop was open , you can fast call to user , cancel the user order , cut finished button remove user but it effects the shop stats was shown , manupulate the order line

  ![image](https://github.com/user-attachments/assets/8ad802cb-56ea-4c4e-ad90-fb1dfec424be)
