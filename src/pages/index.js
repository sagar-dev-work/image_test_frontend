import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";

// Load custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Home Component
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // If token exists, redirect to the dashboard
      router.push("/dashboard");
    } else {
      // If no token, redirect to the login page
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.main}>
        <h1>Redirecting...</h1>
      </main>
    </>
  );
}
