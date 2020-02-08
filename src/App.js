import './App.css';
import React, { useState, useEffect} from 'react';

var request = require('request');

function initialize(name) {
  var options = {
    url: `https://api.github.com/users/${name}`,
    headers: {
      'User-Agent': 'request'
    }
  };

  return new Promise((resolve, reject) =>
    request.get(options, (err, resp, body) =>
      err ? reject(err) : resolve(JSON.parse(body))
    )
  )
};

function App() {
  const [darkTheme, setDarkTheme] = useState(getDefaultTheme())
  const [count, setCount] = useState(0);
  const [avatarUrl, setAvatar] = useState("unknown")
  const [searchName, setSearchName] = useState("unknown")

  const handleInputChange = e => {
    setSearchName(e.target.value)
  }

  useEffect(() => {
    localStorage.setItem('dark', JSON.stringify(darkTheme))
  }, [darkTheme])

  function getDefaultTheme() {
    const selectedTheme = JSON.parse(localStorage.getItem('dark'))
    return selectedTheme || false
  }

  function Avatar() {
    if (avatarUrl === 'unknown') {
      return <></>
    } else {
      return <p><img width='200' height='200' src={avatarUrl} /></p>
    }
  }

  function lookupUser(e) {
    e.preventDefault()
    console.log(`Looking up user ${searchName}`)
    let initializePromise = initialize(searchName)
    initializePromise.then(function(result) {
      console.table(result)
      setAvatar(result.avatar_url)
    }, function(err) {
      console.log(err);
    })
  }

  return (
    <div className={darkTheme ? 'dark-theme' : 'light-theme'}>
      <nav>
        <div className="button-container">
          <button onClick={() => setDarkTheme(prevTheme => !prevTheme)}>
            Toggle Theme
          </button>
          <button onClick={() => setCount(count + 1)}>
            Count 
         </button>
        </div>
      </nav>
      <div className="content">
        <h1>{darkTheme ? 'Dark Mode' : 'Light Mode'}</h1>
        <p>
          Do take a note of the <code>color</code> property
        </p>
        <p>
          You clicked {count} times
        </p>
        <hr></hr>
        <h3>Github lookup stuff</h3>

        <form>
            <input type="text" onChange={handleInputChange} />
            <button onClick={(e) => {lookupUser(e)}}>Lookup</button>
        </form>

        <Avatar />

      </div>
    </div>
  );
}

export default App;
