import { api } from 'app/slice';
import { registerApi } from 'app/pages/Register/slice';
import { GlobalState } from 'app/slice/types';
import { RegisterState } from 'app/pages/Register/slice/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  [api.reducerPath]: ReturnType<typeof api.reducer>;
  [registerApi.reducerPath]: ReturnType<typeof registerApi.reducer>;
  global?: GlobalState;
  register?: RegisterState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
