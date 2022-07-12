import axios from "axios";
import { api } from "../api";


const read = async (channel, userid) => {
  const { data } = await axios.post(
    `https://insentstaging.api.insent.ai/user/channels/${channel}/read`,
    {},
    {
      headers: { authorization: "Bearer 2LejamM1576236866754", userid },
    }
  );
};
const delivered = async (channel, userid) => {
  const { data } = await axios.post(
    `https://insentstaging.api.insent.ai/user/channels/${channel}/delivered`,
    {},
    {
      headers: { authorization: "Bearer 2LejamM1576236866754", userid },
    }
  );
};

