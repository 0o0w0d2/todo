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
insertOne의 callback을 이용하면 console message가 제대로 출력되지 않는 현상으로 인해 try-catch문으로 바꿈
insertOne의 callback이 제대로 작동하지 않는 이유에 대해서 계속 알아봐야 할 듯

### Resolved
- 현재 Node.js와 mongodb 버전의 차이로 인해 비동기 작업에 대한 처리가 강의와는 다른 것으로 보임.
따라서 콜백 함수를 사용하는 경우, 무한 로딩 현상이 나타나기 때문에, 콜백 함수 부분을 1. async/await 2. .then() .catch() 메소드를 사용하는 프로미스 체인 방식으로 변경.
해당 프로젝트에서는 async/await으로 변경.
- async/await 을 사용할 때는 비동기 작업의 성공과 실패를 처리하기 위해 try - catch문과 함께 사용하는 것이 좋음
- 추가적으로 console 의 경우 동기적으로 처리되기 때문에 try - catch 문에서 DB 에서 정보를 가져오는 부분이 비동기적이기 때문에 아래에 console.log('ㅎㅎ')가 있을 경우 DB 에서 정보를 가져오는 부분이 제대로 처리되지 않았다고 해도 console에 'ㅎㅎ'가 출력되기 때문에 try - catch문 바깥에 위치시킴.


