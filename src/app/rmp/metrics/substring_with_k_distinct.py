# 012345                  
 
# abaaaaadbb 'aaad' 
# [0122222
#  (ad)
# [a:1
# b:0
# d:1]
MAX_CHAR = 26 
def isValid(hash_char , k ):
    count = 0 
    for i in range(MAX_CHAR):
        if hash_char[i]:
            count+=1
            if count > k :
                return False
    return True
def kDistinct(s,k ):
    len_string = len(s)
    low = 0 
    high = 0
    hash_char = [0]*MAX_CHAR
    window_start = 0 
    window_end=0
    longest_window  = 0 
    while high < len_string :
        index = ord(s[high]) - ord('a')        
        hash_char[index]+=1
        window_end =high
        if not isValid(hash_char , k ):
            low+=1
            hash_char[ord(s[low]) - ord('a')] -=1
            window_start = low 
            if (window_end - window_start)+1 >longest_window :
                longest_window = (window_end - window_start)+1
        high+=1
    return longest_window , window_start
            
def main():
    string = raw_input()
    print kDistinct(string)
    return 0 