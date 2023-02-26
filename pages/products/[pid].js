import path from "path";
import fs from "fs/promises"; // fs stands for "File System"

const ProductDetailPage = (props) => {
  const { loadedProduct } = props;

  // fallback: true인 경우, 사전 생성되지 않은 path로 url 입력을 통해 직접 접근하려고 하면
  // loadedProduct가 아직 안만들어졌기 때문에 cannot read undefined property 에러가 뜸
  // -> 아래와 같이 loadedProduct가 안만들어졌을 때는 loading문을 출력하는 식의 조건문을 붙여줘야 함!!
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </>
  );
};

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  console.log(context);
  const { params } = context;
  const productId = params.pid;

  // const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  // const jsonData = await fs.readFile(filePath);
  // const data = JSON.parse(jsonData);
  const data = await getData();

  const product = data.products.find((product) => product.id === productId);
  console.log(product);
  // paths에 기재하지 않은 p4에 접근하려고 할때 404페이지를 출력시키기 위해서 {notFound: true} 객체를 리턴
  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// 동적 페이지의 어떤 인스턴스를 생성할지 NextJS에 알려주는 역할을 하는 함수
// s 붙어있는거 유의
export async function getStaticPaths() {
  const data = await getData();

  // data를 동적으로 가져오기 위한 코드
  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    // paths: [
    // { params: { pid: "p1" } },
    // { params: { pid: "p2" } },
    // { params: { pid: "p3" } },
    // ],
    // 사전 생성되어야 할 페이지가 아주 많을 때 사용
    paths: pathsWithParams,
    fallback: true,
  };
}

export default ProductDetailPage;
