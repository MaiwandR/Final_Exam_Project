# Final_Exam_Project: *TradersHub*

### Main Features: 
- **Stock Front Page:** This will be the homepage and will use the API to show active, profitable, and losing stocks

  - **API URL HOME**: https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo *(Make a free API Key and use it while you are working)*
  - For the page in the current version, I have dummy data you can use if you run out of tokens for the API
- **Stock Detail Page:** This page will take a stock name like TSLA, AAPL, etc, and then show info about it. Currently, just the opening and closing data of the last 10 days for a stock.
    - **Detail Page URL:** https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=demo
- **Register Page:** This page will basically be activated when someone wants to buy or sell. *(For this page to show up the session.userid should no exist)*
    - Data is saved to monogodb and you can acess my acount since I'll make it open for everyone.
- **Login Page**: Just a way for users to enter their username and password -> this is checked in MongoDB, and if they are correct, they are taken -> HOMEPAGE
If not -> ERROR MESSAGE -> same Page

### Features Yet Completed:
- Buy Button: must increase the share amount for a stock
- Sell Button: Must decrease the share amount for a stock
- User dashboard with owned stocks and history of transactions

### Important Resources:
- API Documentation: https://www.alphavantage.co/documentation/
- This is what your .env should look like:
  - API_KEY = '4T8RGLNO9B2C5PCI'
  - DB_CONNECT_STRING = 'mongodb+srv://maiwandraheem:Wawreena1234@cluster0.2rftkuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  - DB_NAME = Stocks
  - MONGO_COLLECTION = userStocks
  - SESSION_SECRET = '8c62812784392ae64d9b07e3e3355e32cb20cf636c9a36927ab77ddb3c40912c'
 





Submitted by: Maiwand Raheem (directory id: mraheem)

Group Members: Maiwand Raheem (mraheem), Abdullatif Elmuaqqat (Aelmuaqq), Abdullah Shamsan (Ashamsan), 

App Description: TradersHub is a stock simulator platform where users can register, view real-time stock data, and simulate buying and selling shares. All transactions are stored and displayed in each user's personal dashboard.

YouTube Video Link: 

APIs: Stocks API (https://www.alphavantage.co/documentation/)

Contact Email: mraheem@terpmail.umd.edu

Contact Email: aelmuaqq@terpmail.umd.edu

Deployed App Link: 
    
