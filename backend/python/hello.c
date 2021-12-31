// 学籍番号　B2190350
// 名前　　　大森裕介

#include <stdio.h>
#include <math.h>

double myfloor(double n){
    int i = 1000000000;
    n = n*i;
    n = floor(n);
    n = n/i;
    return n;
}

int main()
{
  double num;
//   num = myfloor(1.297368189);
  printf("%f\n",num);
  int i,j,k;

  double a[5][5]={{0,3,4,1,-3},{-1,0,-2,2,4},{4,2,0,-3,5},{5,-4,-3,0,1},{1,2,3,4,1}};
  double b[5]={9, 0, 3, 5, 0};
  int N=5; // 変数の数、行列の次元

//   double a[4][4]={{1,2,1,1},{4,5,-2,4},{4,3,-3,1},{2,1,1,3}};
//   double b[4]={-1, -7, -12, 2};
//   int N=4; // 変数の数、行列の次元

  
  for(i=0; i < N; ++i){
    for(j=0; j < N; ++j){
      printf("%f ", a[i][j]); //配列a,bを行列とベクトル風に表示
    }
    printf("%f\n",b[i]);
  }

  // 前進消去
  for(k=0; k < N; ++k){
    b[k]=myfloor(b[k]/a[k][k]); 
    printf("%f", b[k]);
    for(j=N-1; j >= k; --j){
      a[k][j] = a[k][j]/a[k][k]; //(your codes) // 第k行を対角成分a[k][k] で規格化
    }
    for(i=k+1; i < N; ++i){
      b[i]=b[i]-b[k]*a[i][k]; 
      for(j=N-1; j >= k; --j){
	      a[i][j] = a[i][j] - a[k][j]*a[i][k]; //(your codes) // 第i行(k<i<N) について第 k 列を 0 にする
      }
    }
   
    printf("k:%d\n",k);
    for(i=0; i < N; ++i){
      for(j=0; j < N; ++j){
	      printf("%f ", a[i][j]); // 行列の出力
      }
      printf("%f\n",b[i]);
    }
  }

  // 後退代入 
  for(j=N-1; j > 0; --j){
    for(i=j-1; i >= 0; --i){
      b[i] = b[i] - b[j]*a[i][j]; //(your codes) // 第i行(0<i<N)について第 j 列を 0 にする
      a[i][j] = 0;
    }
  }
  
  
  printf("k:%d\n",k);
  for(i=0; i < N; ++i){
    for(j=0; j < N; ++j){
      printf("%f ", a[i][j]); // 行列の出力
    }
    printf("%f\n",b[i]);
  }
}
