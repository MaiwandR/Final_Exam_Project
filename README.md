# Final_Exam_Project: *TradersHub*

Submitted by: Maiwand Raheem (directory id: mraheem)

Group Members: Maiwand Raheem (mraheem), Abdullatif Elmuaqqat (Aelmuaqq), Abdullah Shamsan (Ashamsan), Alexis Bantilan (abantila)

App Description: TradersHub is a stock simulator platform where users can register, view real-time stock data, and simulate buying and selling shares. All transactions are stored and displayed in each user's personal dashboard.

YouTube Video Link: https://youtu.be/OI1tSPNjzfQ

APIs: Stocks API (https://www.alphavantage.co/documentation/)

Contact Email: mraheem@terpmail.umd.edu

Contact Email: aelmuaqq@terpmail.umd.edu

Deployed App Link: https://final-exam-project-2.onrender.com
    
App Details:

### Main Features: 
- **Stock Front Page:** This will be the homepage and will use the API to show active, profitable, and losing stocks

  - **API URL HOME**: https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo
        *(Make a free API Key and use it while you are working)*
  - For the page in the current version, I have dummy data you can use if you run out of tokens for the API
- **Stock Detail Page:** This page will take a stock name like TSLA, AAPL, etc, and then show info about it. Currently, just the opening and closing data of the last 10 days for a stock.
    - **Detail Page URL:** https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=demo
- **Register Page:** This page will basically be activated when someone wants to buy or sell. *(For this page to show up the session.userid should no exist)*
    - Data is saved to monogodb and you can acess my acount since I'll make it open for everyone.
- **Login Page**: Just a way for users to enter their username and password -> this is checked in MongoDB, and if they are correct, they are taken -> HOMEPAGE
If not -> ERROR MESSAGE -> same Page

### Future Plans:
- Use a prediction model to help users predict whether the stock will go up or down based on past data
- Have payment authentication
- Have the user dashboard contain a holistic breakdown of the stocks they have
 
