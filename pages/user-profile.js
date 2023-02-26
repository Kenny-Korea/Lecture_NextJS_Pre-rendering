import React from "react";

const UserProfilePage = (props) => {
  return (
    <>
      <h1>{props.username}</h1>
    </>
  );
};

export default UserProfilePage;

// SSR은 SSG와 다르게 빌드 시 생성되는 것이 아니라 요청이 들어올 때마다 불러오는 것임(사전 생성 x)
// 해당 함수는 클라이언트가 아닌 배포된 서버와 개발 서버에서만 실행됨(중요한 차이점!!)
// -> 서버에서만 작동하는 코드
export async function getServerSideProps(context) {
  const { params, req, res } = context;
  // console.log("Server side code");
  return { props: { username: "Max" } };
}
