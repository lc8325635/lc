text = input("Enter some text:")
length = len(text)
for index in range(length):
    letter = text[index]
    print("The letter at index", index, "is", letter)
