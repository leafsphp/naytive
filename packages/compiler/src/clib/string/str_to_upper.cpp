#include "str_to_upper.h"

std::string str_to_upper(std::string str)
{
  for (int i = 0; i < str.size(); i++)
  {
    if (str[i] >= 'a' && str[i] <= 'z')
    {
      str[i] = str[i] - 32;
    }
  }

  return str;
};
