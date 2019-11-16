import React from 'react';
import styled from 'styled-components';

export default function ProfilePage(props) {
  return (
    <div>
      This is my profile page. Where I can overview and create surveys. Probably just focus<br/>
      on the ability to create a survey. Gathering data from the database at this point,
      will occur when I send a request for this specific user with the authorized route and token and headers.
    </div>
  );
}
