# sos-web

## 실행방법

0. 웹 페이지 링크([http://www.yu-sos.co.kr](http://www.yu-sos.co.kr))로 접속한다.
1. 병원 기능(접수 요청 관련, 접수 관련, 정보 수정) 등은 병원 로그인 후 사용이 가능하다.
   - 테스트용 아이디 1 - ID: testhos1 / PW: testhos1
   - 테스트용 아이디 2 - ID: testhos14 / PW: testhos14 (회원가입 요청 대기 중인 구급대, 로그인 실패 확인 용)
   - 테스트용 아이디 3 - ID: testhos15 / PW: testhos15 (회원가입 요청 거절당한 구급대, 로그인 실패 확인 용)
2. 어드민 기능(시스템 정보 확인, 구급대/병원 회원가입 요청 확인)
    - 테스트용 아이디 - ID: admin / PW: admin

---

## 📌 Convention

### branch naming
```
main - develop - feature/*
```

### commit message 
|type|description|
|:-:|---|
|feat|새로운 기능 개발, 요구사항을 반영한 기능 수정|
|fix|기능에 관한 버그 수정|
|style|코드에 변화가 없는 코드 스타일, 포맷팅에 관한 수정|
|refact|기능 변화가 아닌 코드 리팩토링|
|test|테스트 코드 추가/수정|
|chore|그 외 수정사항 ex) 패키지매니저, 파일/디렉토리 이름・위치 변경|
|docs|문서・주석 수정|

