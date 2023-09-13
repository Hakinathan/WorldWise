import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="back"
      onClick={(e) => {
        // preventDefault() prevents the default behavior of the event from occurring
        e.preventDefault();
        // navigate(-1) is the same as clicking the back button in the browser window (or pressing the back button on the keyboard)
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
