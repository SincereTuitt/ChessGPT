import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { hourglass } from "ldrs";
hourglass.register('loading-icon');
import king from '../../assets/kingImage.png';
import '../../styles/king.css';

const King = () => {
  const isTwoPlayer = useSelector((state) => state.settings.isTwoPlayer);
  const [text, setText] = useState('I will lead my army to victory or die trying!');
  const [isLoading, setIsLoading] = useState(false);

  // OpenAI API call
  useEffect(() => {
    const gpt = window.addEventListener('message', (e) => {
      if (e.data.request === 'gpt') {

      }
    })
  })

  return (
    <div 
    id="kingContainer" 
    style={{display: isTwoPlayer ? "none" : "block"}}
    >
      <img src={king}/>
      {
        isLoading 
        ?
        <loading-icon></loading-icon>
        : 
        <loading-icon></loading-icon>
        // <h3>{text}</h3>
      }
      
    </div>
  )
}

export default King