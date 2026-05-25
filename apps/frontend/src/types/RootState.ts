import { GlobalState } from 'app/slice/types';
import { initialState } from 'app/slice';
import { RegisterState } from 'app/pages/Register/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  globalApi: any;
  registerApi: any;
  global?: GlobalState;
  register?: RegisterState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
