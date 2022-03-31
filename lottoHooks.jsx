import React, { useState, useRef, useEffect, useMemo } from "react";
import Ball from "./Ball";

function getWinNumbers() {
  console.log("getWinNumbers");
  const candidate = Array(45)
    .fill()
    .map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)
    )[0];
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((a, b) => a - b);
  return [...winNumbers, bonusNumber];
}

const Lotto = () => {
  const lottoNumbers = useMemo(() => getWinNumbers(), []);
  // useMemo: 복잡한 함수 결과값(리턴값)을 기억 useRef: 일반값을 기억 useCallback: 함수자체를 기억
  // useCallback을 필수적으로 사용해야 할 때: 자식 컴포넌트로 넘겨주는 props가 함수일때 useCallback을 통해 저장하여 넘겨줘야 자식컴포넌트의 불필요한
  // 렌더링을 막을 수 있다.
  // useEffect를 이용해 componentDidMount에는 실행하지 않고 componentDidUpdate에서만 실행되도록 하는 방법
  // const mounted = useRef(false);
  // const useEffect(() => {
  //  if (!mounted.current) {
  //    mounted.current = true;
  //  } else {
  //     실행할 함수
  //  }
  //}, [바뀌는 값]);
  const [winNumbers, setWinNumbers] = useState(lottoNumbers);
  const [winBalls, setWinBalls] = useState([]);
  const [bonus, setBonus] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);

  const runTimeouts = () => {
    for (let i = 0; winNumbers.length - 1 > i; i++) {
      timeouts.current[i] = setTimeout(() => {
        setWinBalls((prev) => [...prev.winBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBonus(winBalls[6]);
      setRedo(true);
    }, 7000);
  };

  useEffect(() => {
    console.log("first rendering");
    runTimeouts();
    return () => {
      //return하는 내용이 componentWillUnmount에 해당함
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      });
    };
  }, [timeouts.current]); // 두번째 인자가 빈 배열이면 componentDidMount와 동일함

  const onClickRedo = () => {
    console.log("다시뽑기 누름");
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  };

  return (
    <>
      <div>추첨 결과는?</div>
      <div id="result">
        {winBalls.map((v) => (
          <Ball key={v} number={v} />
        ))}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} />}
      {redo ? <button onClick={onClickRedo}>다시뽑기</button> : null}
    </>
  );
};

export default Lotto;
