#include "str_to_array.h"

std::vector<std::string> stringToArray(const std::string &str)
{
  std::vector<std::string> result;
  std::istringstream iss(str);
  std::string word;

  while (iss >> word)
  {
    result.push_back(word);
  }

  return result;
};
