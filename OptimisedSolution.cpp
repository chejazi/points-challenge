/*
    This Algorithm calculates the points as described in the problem statement. Major code-blocks are commented and code within them pretty straight-forward.
*/

#include <iostream>

using namespace std;

int main()
{
    float N,point,k,A,k2,A4,A5,A6,k3,A3;
    float a[10];
    float A2[10];
    float points[10];
    float points2[10];
    string name[4];
    string lol,hellyeah;

    int count=1;
    int renew=0;

    cout<<"enter fixed intervals\t";
    cin>>N;
    cout <<"add first person name\t";
    cin>>name[0];
    cout << "enter starting interval\t";
    cin>> k;
    cout<<"amount1\t";
    cin>>A;

    cout<<"want to add second person(Yes or No)\t";
    cin>>lol;
    if((lol=="Yes")||(lol=="yes")||(lol=="YES"))
    {
        cout <<"enter name of 2 person\t";
        cin>>name[1];
        cout <<"Amount 2\t";
        cin>>A4;
        cout << "enter starting interval of 2 person\t";
        cin>>k2;
        A3=(A4/N);
        count=2;
    }
    else
    {
        count=1; 
    }

    cout<<"want to renew first person amount(Yes or No)\t ";
    cin>>hellyeah;
    if((hellyeah=="YES")||(hellyeah=="yes")||(hellyeah=="YES"))
    {
        cout<<"enter renewal amount of alice";
        cin>>A5;
        cout<<"enter renewal interval";
        cin>>k3;
        A3=(A4/N);
        A6=(A5/N);
        renew=1;
    }
    else
    {
        renew=0;
    }

    //initialize all values to zero
    for(int i=0;i<10;i++)
    {
       a[i]=0;
       points[i]=0;
       points2[i]=0;
       A2[i]=0;
    }

    float A1=(A/N);

    for(int i=k-1;i<k-1+N;i++)
    {
        a[i]=A1;       
    }
    
    //First Person's results only
    if((count==1)&&(renew==0))
    {
        for(int i=0;i<=9;i++)
        {
            if(a[i]>0)
            {
                points[i]=points[i-1]+1;
            }
            else if(a[i]<0)
            {
                points[i]=0;
            }
        }
        for(int i=0;i<10;i++)
        {
            
            cout<<"interval"<<"\t"<<i+1<<"\t";
            cout<<name[0]<<"\t"<<points[i]<<"\t";
            cout<<"spent"<<"\t"<<a[i]<<"\t";
            cout<<"Total Points"<<"\t"<<points[i]+points2[i]<<"\t\n";
        }
    }

    //First and Second Persons' results
    if((count==2)&&(renew==0))
    {
       for(int i=k2-1;i<k2-1+N;i++)
        {
            A2[i]=A3;
        }
        for(int i=0;i<=9;i++)
        {
            if(a[i]>0)
            {
                points[i]=(a[i]/(a[i]+A2[i])) + points[i-1];
            }
            else if(a[i]<0)
            {
                points[i]=0;
            }
        }
        for(int i=0;i<=9;i++)
        {
            if(A2[i]>0)
            {
                points2[i]=(A2[i]/(a[i]+A2[i])) + points2[i-1];
            }
            else if(A2[i]<0)
            {
                points2[i]=0;
            }
        } 
        for(int i=0;i<10;i++)
        {
            cout<<"interval"<<"\t"<<i+1<<"\t";
            cout<<name[0]<<"\t"<<points[i]<<"\t";
            cout<<"spent "<<"\t"<<a[i]<<"\t";
            cout<<name[1]<<"\t"<<points2[i]<<"\t";
            cout<<"spent"<<"\t"<<A2[i]<<"\t";
            cout<<"Total Points"<<"\t"<<points[i]+points2[i]<<"\t\n";
            
        } 
    }

    //First person after Renewal
    if((count==1)&&(renew==1))
    {
        for(int i=k3-1;i<k3-1+N;i++)
        {
          a[i]=a[i]+A6;
        }
        for(int i=0;i<10;i++)
        {
          if(a[i]>0)
          {
              points[i]=points[i-1]+1;
          }
          else if(a[i]<0)
          {
              points[i]=0;
          }
        }
        for(int i=0;i<10;i++)
        {          
            cout<<"interval"<<"\t"<<i+1<<"\t";
            cout<<name[0]<<"\t"<<points[i]<<"\t";
            cout<<"spent"<<"\t"<<a[i]<<"\t";
            cout<<"Total Points"<<"\t"<<points[i]+points2[i]<<"\t\n";
        }
     }

    //First person after Renewal; and Second Person
     if((count==2)&&(renew==1))
     {
         for(int i=k3-1;i<k3-1+N;i++)
        {
            a[i]=a[i]+A6;
        }
        for(int i=k2-1;i<k2-1+N;i++)
        {
            A2[i]=A3;   
        }
        for(int i=0;i<=9;i++)
        {
        if(a[i]>0)
            {
                points[i]=(a[i]/(a[i]+A2[i])) + points[i-1];
            }
            else if(a[i]<0)
            {
                points[i]=0;
            }
        }
        for(int i=0;i<=9;i++)
        {
            if(A2[i]>0)
            {
                points2[i]=(A2[i]/(a[i]+A2[i])) + points2[i-1];
            }
            else if(A2[i]<0)
            {
                points2[i]=0;
            }
        }
        for(int i=0;i<10;i++)
        {          
            cout<<"interval"<<"\t"<<i+1<<"\t";
            cout<<name[0]<<"\t"<<points[i]<<"\t";
            cout<<"spent"<<"\t"<<a[i]<<"\t";
            cout<<name[1]<<"\t"<<points2[i]<<"\t";
            cout<<"spent"<<"\t"<<A2[i]<<"\t";
            cout<<"Total Points"<<"\t"<<points[i]+points2[i]<<"\t\n";
        }
     }
    return 0;
}
