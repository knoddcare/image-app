import styled from "styled-components";
import ImageComponent from './components/images/Images';

const AppContainer = styled.div`
  display: flex;
  flex: 1 0 800;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(0, 0, 0);
  
  div {
    margin: 20px 0;
    padding: 20px 40px;
    max-width: 800;
    max-height: 800;
    color: white;
    font-size: calc(10px + 2vmin);
    border-radius: 25px;
  }

  .App-header {
    text-align: center;
    background-color: rgb(41, 55, 41);
  }

  .App-body {
    background-color: rgb(70, 55, 70);
  }
`;

function App() {
  return (
    <AppContainer>
      <div className="App-header">
        <h1>Image Uploading App</h1>
      </div>
      <div className="App-body">
        <ImageComponent />
      </div>
    </AppContainer>
  );
}

export default App;
