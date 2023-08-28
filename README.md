# todo

express.js + ejs
mongoDB

## Migration

1. react를 사용해 client side rendering
2. 프레임워크를 django로 변경
3. mongoDB를 mongoose 라이브러리를 적용해보기
4. DB를 noSQL인 mongoDB에서 RDB인 mySQL이나 PostgreSQL로 변경

---

## 1

### Problem

insertOne의 callback을 이용하면 console message가 제대로 출력되지 않는 현상으로 인해 async/await + try-catch문으로 바꿈
insertOne의 callback이 제대로 작동하지 않는 이유에 대해서 계속 알아봐야 할 듯

### Resolved

- 현재 Node.js와 mongodb 버전의 차이로 인해 비동기 작업에 대한 처리가 강의와는 다른 것으로 보임.(호환성?)
  따라서 콜백 함수를 사용하는 경우, 무한 로딩 현상이 나타나기 때문에, 콜백 함수 부분을 1. async/await 2. .then() .catch() 메소드를 사용하는 프로미스 체인 방식으로 변경.
  해당 프로젝트에서는 async/await으로 변경.
- async/await 을 사용할 때는 비동기 작업의 성공과 실패를 처리하기 위해 try - catch문과 함께 사용하는 것이 좋음
- 추가적으로 console 의 경우 동기적으로 처리되기 때문에 try - catch 문에서 DB 에서 정보를 가져오는 부분이 비동기적이기 때문에 아래에 console.log('ㅎㅎ')가 있을 경우 DB 에서 정보를 가져오는 부분이 제대로 처리되지 않았다고 해도 console에 'ㅎㅎ'가 출력되기 때문에 try - catch문 바깥에 위치시킴.

## 2

### auto increment

- soft delete의 방식을 이용하게 된다면 총 게시물 갯수가 변화될 일이 없으니까 \_id 값을 총 게시물 갯수 + 1로 표현해도 괜찮지 않을까?
  -> 근데 현재 제공되는 서비스들을 생각해본다면 일정 기간 동안은 그 게시물/계정에 대한 정보를 남겨놓고 그 기간이 지나면 삭제되게끔 하고 있기 때문에 의미없는 것일라나라는 생각도 좀 듬.
- mongoose를 사용하면 자체적으로 auto increment 기능을 제공한다고 함(최신 버전)
- mySQL의 경우에는 자체적으로 auto increment 기능이 있음(다른 RDB의 경우에도,, 비슷하지 않을까?)
- mongoDB가 자체적으로 부여해주는 \_id 값을 사용하는 것이 충분하긴 함 (물론 보기에 딱 와 닿는 느낌이 아니라서 그렇지)

## 3

### mongodb의 트랜잭션

- 나중에 추가하기!

```
MongoDB의 트랜잭션은 'session'을 통해 작동하며, 트랜잭션 내에서 수행되는 모든 작업은 해당 세션에 속하게 됨. 'session'을 사용하면 여러 작업을 하나의 트랜잭션으로 묶을 수 있고, 이 작업들이 성공적으로 완료되거나 실패하면 해당 트랜재션 내의 모든 작업이 원자적으로 커밋 또는 롤백됨.

1. 세션을 시작
  'const session = await client.startSession()'
2. 세션 내에서 트랜잭션 시작
  'session.startTransaction()'
3. 세션 내에서 작업을 수행
4-1. 트랜잭션이 정상적으로 수행 : 세션 내에서 트랜잭션 커밋
  'session.commitTransaction()'
4-2. 트랜잭션의 여러 작업 중 하나라도 실패하거나 예외가 발생 : 작업을 롤백(트랜잭션이 커밋되기 전)
  'session.abortTransaction()'
5. 세션 종료
  'session.endSession()'
```
