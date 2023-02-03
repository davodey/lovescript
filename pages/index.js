import Head from "next/head";
import {useState, useEffect, useRef} from "react";
import styles from "./index.module.css";
import * as FullStory from '@fullstory/browser'
export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();
  const spin = useRef()
	const text = useRef()
	useEffect(() => {
		FullStory.init({ orgId: 'o-1H09SG-na1'});
	}, []);
  async function onSubmit(event) {
    event.preventDefault();
	spin.current.style.display = 'inline-flex';
	  text.current.style.display = 'none';
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: textInput }),
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setTextInput("");
		spin.current.style.display = 'none';
		text.current.style.display = 'inline-flex';
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (

    <div>
      <Head>
        <title>Love Script Pro - The smart way to write your dating profile.</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
		  <svg  className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
			  <path d="M244 84L255.1 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 0 232.4 0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84C243.1 84 244 84.01 244 84L244 84zM255.1 163.9L210.1 117.1C188.4 96.28 157.6 86.4 127.3 91.44C81.55 99.07 48 138.7 48 185.1V190.9C48 219.1 59.71 246.1 80.34 265.3L256 429.3L431.7 265.3C452.3 246.1 464 219.1 464 190.9V185.1C464 138.7 430.4 99.07 384.7 91.44C354.4 86.4 323.6 96.28 301.9 117.1L255.1 163.9z"/></svg>
        <h3>Dating Profile Analyzer:</h3>
		  <p>Enter your dating profile for a review and rating from 1-10.</p>
        <form onSubmit={onSubmit}>
			<div className={styles.flex}>
			  <textarea
				  type="text"
				  name="animal"
				  placeholder="Enter your existing dating profile"
				  value={textInput}
				  onChange={(e) => setTextInput(e.target.value)}
				  id="myTextArea"
				  className={styles.textarea}
			  ></textarea>
			</div>
			<button type="submit" className={styles.submitButton}>
				<span ref={spin} className={styles.spinner} >
<svg width={20} height={20} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <circle cx={50} cy={50} fill="none" stroke="white" strokeWidth={10} r={35} strokeDasharray="164.93361431346415 56.97787143782138">
    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1" />
  </circle>
</svg>
					Expert reviewing profile...
				</span>
				<span ref={text} className="text" style={{display: 'inline-flex'}}>Analyze</span>
			</button>

        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
