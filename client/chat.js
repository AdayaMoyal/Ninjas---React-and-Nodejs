import React, { useState } from 'react';
import axios from 'axios';

var answer = "";
var malicious = false;

const Chat = ({ information }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const handleMessageFromClient = async () => {
      const query = input.indexOf(" - ");
      var question = "";
      var value = "";
      if(query !== -1)
      {
        question = input.slice(0, query);
        value = input.slice(query+3);
      }
      else
      {
        question = input;
      }
      switch(question){
        case 'names':
          answer = getNamesRequest();
          break;
        case 'ids':
          answer = getIdsRequest();
          break;
        case 'descriptions':
          answer = getDescriptionsRequest();
          break;
        case 'x_mitre_platforms':
          answer = getX_mitre_platformsRequest();
          break;
        case 'x_mitre_detections':
          answer = getX_mitre_detectionsRequest();
          break;
        case 'phase_names':
          answer = getPhase_namesRequest();
          break;
        case 'id':
          answer = getIdByName(value);
          break;
        case 'description':
          answer = getDescriptionByName(value);
          break;
        case 'x_mitre_platform':
          answer = getX_mitre_platformsByName(value);
          break;
        case 'x_mitre_detection':
          answer = getX_mitre_detectionsByName(value);
          break;
        case 'phase_name':
          answer = getPhase_nameByName(value);
          break;
        case 'check signature':
          await checkSignature(value);
          if(malicious === true)
          {
            answer = "Detected as malicious.";
          }
          else
          {
            answer = "Not detected as malicious.";
          }
          break;
        case 'analyze file':
          await uploadFileInCuckoo(value);
          break;
        case 'analyze URL':
          await uploadURLInCuckoo(value);
          break;
        case 'clean':
          setMessages([]);
          setAnswers([]);
          answer = "Cleaned";
          break;
        default:
          answer = "I am sorry, but I am not qualified to answer this query.";
          break;
      };
      if(answer === "")
      {
        answer = "This name is not in database.";
      }
      setInput('');
      setMessages(messages=>[...messages, { content: input }]);
      setAnswers(answers=>[...answers, { content: answer }]);
    };

  const getChangedInput = (newInput) => {
      setInput(newInput.target.value);
    };

    const uploadFileInCuckoo = async (path) => {
      const url = 'http://localhost:7000/path?' + path;
      const response = await fetch(url);
      if (response.ok) {
        const responseData = await response.text();
        answer = responseData.substring(1, responseData.length-1);
      } 
      else 
      {
        answer = response.status;
      }
    };
    
    const uploadURLInCuckoo = async (clientURL) => {
      const url = 'http://localhost:7000/URL?' + clientURL;
      const response = await fetch(url);
      if (response.ok) {
        const responseData = await response.text();
        answer = responseData.substring(1, responseData.length-1);
      } 
      else 
      {
        answer = response.status;
      }
    };

    const checkSignature = async (signature) => {
      try {
        const request = {
          method: 'GET',
          url: 'https://www.virustotal.com/api/v3/files/'+signature,
          headers: {
            'x-apikey': '9a8e3f33aa9364437186c451633aa76a121ba20a1c8bd7c33411b2605f8bd61d'//my key
          }
        };
        const response = await axios.request(request);
        const maliciousOrNot = response.data.data.attributes.last_analysis_stats.malicious;
        if(maliciousOrNot > 0)
        {
            malicious = true;
        }
        else
        {
          malicious = false;
        }
        }
        catch(e)
        {
          //
        }
    };

    const getNamesRequest = () => {
      var names = "";
      for (let i = 0; i < information.length; i++) 
      {
        names += information[i].name + "\n";
      }
        return names;
    };

    const getDescriptionsRequest = () => {
      var descriptions = "";
      for (let i = 0; i < information.length; i++) 
      {
        descriptions += information[i].description + "\n";
      }
        return descriptions;
    };

    const getIdsRequest = () => {
      var ids = "";
      for (let i = 0; i < information.length; i++) 
      {
        ids += information[i].id + "\n";
      }
        return ids;
    };

    const getX_mitre_platformsRequest = () => {
      var X_mitre_platforms = "";
      for (let i = 0; i < information.length; i++) 
      {
        X_mitre_platforms += information[i].x_mitre_platforms + "\n";
      }
        return X_mitre_platforms;
    };

    const getX_mitre_detectionsRequest = () => {
      var x_mitre_detections = "";
      for (let i = 0; i < information.length; i++) 
      {
        x_mitre_detections += information[i].x_mitre_detection + "\n";
      }
        return x_mitre_detections;
    };

    const getPhase_namesRequest = () => {
      var phase_names = "";
      for (let i = 0; i < information.length; i++) 
      {
        phase_names += information[i].phase_name + "\n";
      }
        return phase_names;
    };

    const getIdByName = (name) => {
      var id = "";
      for (let i = 0; i < information.length; i++) 
      {
        if(information[i].name === name)
        {
          id += information[i].id;
        }
      }
        return id;
    };

    const getDescriptionByName = (name) => {
      var description = "";
      for (let i = 0; i < information.length; i++) 
      {
        if(information[i].name === name)
        {
          description += information[i].description;
        }
      }
        return description;
    };

    const getX_mitre_platformsByName = (name) => {
      var X_mitre_platforms = "";
      for (let i = 0; i < information.length; i++) 
      {
        if(information[i].name === name)
        {
          X_mitre_platforms += information[i].x_mitre_platforms;
        }
      }
        return X_mitre_platforms;
    };

    const getX_mitre_detectionsByName = (name) => {
      var X_mitre_detection = "";
      for (let i = 0; i < information.length; i++) 
      {
        if(information[i].name === name)
        {
          X_mitre_detection += information[i].x_mitre_detection;
        }
      }
        return X_mitre_detection;
    };

    const getPhase_nameByName = (name) => {
      var Phase_name = "";
      for (let i = 0; i < information.length; i++) 
      {
        if(information[i].name === name)
        {
          Phase_name += information[i].phase_name;
        }
      }
        return Phase_name;
    };

  return (
    <div>
        <div className='content'>
        <div className='botDesign'>Hello Sir/Madam! 
        I'm a bot created to help you. How can I help today?</div>
        {answers.map((message, index) => (
            <>
            <div className='questionDesign'>{messages[index].content}</div>
            <div className='botDesign'>{message.content}</div>
            </>
        ))}
        </div>
        <input className='chatInput'
          placeholder="Enter your query"
          value={input}
          type="text"
          onChange={getChangedInput}
        />
        <button className='chatBt' onClick={handleMessageFromClient}>Send Request</button>
    </div>
  );
}
export default Chat;