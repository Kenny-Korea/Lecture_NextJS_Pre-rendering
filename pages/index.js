import path from "path";
import fs from "fs/promises"; // fs stands for "File System"
import Link from "next/link";

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

// 사전 생성을 위한 getStaticProps
export async function getStaticProps(context) {
  console.log("Generating");
  console.log(context);

  // cwd: Current Working Directory
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  // Data Fetching에 실패했을 경우, {notFound: true} 객체를 리턴하여 404페이지 출력
  if (data.products.length === 0) {
    return { notFound: true };
  }

  if (!data) {
    return { redirect: { destination: "/no-data" } };
  }

  return {
    // 사전에 생성한 데이터를 페이지에서 바로 사용할 수 있도록 props 객체를 리턴해두어야 함
    // 항상 객체를 리턴해야 함
    props: {
      products: data.products,
    },
    revalidate: 3,
  };
}

export default HomePage;
