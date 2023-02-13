from urllib import request
import pandas as pd #handle data like columns and rows
import matplotlib.pyplot as plt
from flask import Flask,request
from pmdarima import auto_arima
import warnings
from statsmodels.tsa.statespace.sarimax import SARIMAX

app=Flask(__name__)

def project_api_routes(endpoints):
    @endpoints.route('/uploader',methods=["POST","GET"])
    def upload_file():
        resp={}
        try:
            req=request.form

            file=request.files.get('file')
            period=request.form.get('startdate')

            df=pd.read_csv(file,index_col='Date',parse_dates=True)           
            print(df.head())
            print(df.isnull().sum())
            print(df.shape)
            print(df.info())
           
            warnings.filterwarnings("ignore")
            stepwise_fit=auto_arima(df['Total'],start_p=1,start_q=1,max_p=3,max_q=3,m=12,start_P=0,seasonal=True,d=None,D=1,trace=True,error_action='ignore',suppress_warnings=True,stepwise=True)
            stepwise_fit.summary()

            train=df.iloc[:-13]#iloc=helps us to select specific row or column from a dataset
            test=df.iloc[-13:]

            model=SARIMAX(train['Total'],order=(0,1,3),seasonal_order=(0,1,1,12))
            result=model.fit()
            result.summary()

            start=len(train)
            end=len(train)+len(test)-1
            prediction=result.predict(start,end,typ='levels')
            prediction.plot(legend=True)#legend-assign meaning to plots
            test['Total'].plot(legend=True)
            plt.title("Prediction vs Actual")
            plt.savefig("C:/Users/HARSHINI/sample/sales_prediction2/src/assets/images/predact.png")
            prediction.to_csv('final_graph.csv')
            test['Total'].to_csv('final_graph1.csv')
            plt.show()

            model=SARIMAX(df['Total'],order=(0,1,3),seasonal_order=(0,1,1,12))
            result=model.fit()

            forecast=result.predict(start=len(df),end=(len(df)-1)+int(period),typ='levels')
            #print(forecast)
            df['Total'].plot(figsize=(12,6),legend=True)
            forecast.plot(legend=True)
            plt.title("Forecast")
            plt.savefig("C:/Users/HARSHINI/sample/sales_prediction2/src/assets/images/forecast.png")
            df['Total'].to_csv('forecast1.csv')
            forecast.to_csv('forecast.csv',index_label='Date')
            plt.show()            
        
        except Exception as e:
            print(e)
            status={
                "statusCode":"400",
                "statusMessage":str(e)
            }
        resp["status"] = status
        return resp

    return endpoints
