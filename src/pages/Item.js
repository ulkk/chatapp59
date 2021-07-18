import "firebase/storage";
// import Room from "./Room"

export const Item = ({ user, content, time, avatar }) => {
  return (
    <li>
      <img style={{ width: "100px" }} src={avatar} alt="" />
      {/* <br /> */}
      {user}:{content} {time}
    </li>
  );
};

export default Item;
