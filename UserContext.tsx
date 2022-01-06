// Copyright (c) Microsoft.
// Licensed under the MIT license.

// <UserContextSnippet>
import * as React from 'react';
import { ImageSourcePropType } from 'react-native';

type UserContextType = {
  userLoading: boolean;
  userFirstName: string;
  userFullName: string;
  userEmail: string;
  userTimeZone: string;
  userPhoto: string;
}

export const UserContext = React.createContext<UserContextType>({
  userLoading: true,
  userFirstName: '',
  userFullName: '',
  userEmail: '',
  userTimeZone: '',
  userPhoto:''
});
// </UserContextSnippet>
