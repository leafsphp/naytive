#include "str_replace.h"

std::string str_replace(std::string str, std::string from, std::string to)
{
  size_t start_pos = 0;

  while ((start_pos = str.find(from, start_pos)) != std::string::npos)
  {
    str.replace(start_pos, from.length(), to);
    start_pos += to.length();
  }

  return str;
};
