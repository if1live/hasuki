import { Container } from "semantic-ui-react";
import "./App.css";
import hasukiLogo from "./assets/hero.webp";

function App() {
  return (
    <Container text>
      <h1>hasuki</h1>
      <img src={hasukiLogo} className="ui large image" alt="hasuki" />
    </Container>
  );
}

export default App;
