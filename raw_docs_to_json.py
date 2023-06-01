import os, sys, json
sys.path.append("..")
from documents import document_list

FRAGMENT_INDICES_TO_IGNORE = [514, 87, 193, 364, 776, 842, 90, 363, 551, 696, 754, 890, 901]

clean_document_list = []

def get_fragment_by_ind(doc_list, ind):
    """
    doc_list should be json array:
    [
        {"ind": int,
        "text": str}, ...
    ]
    """
    return [x for x in doc_list if x["ind"]==ind][0]

def clean_doc(raw_doc):
    """
    Function to clean document text to keep only letters and remove stopwords
    Returns a string of the cleaned document text
    """
    # letters_only = re.sub("[^a-zA-Z]", " ", raw_doc)
    # words = letters_only.lower().split()
    # stopwords_eng = set(stopwords.words("english"))
    # useful_words = [x for x in words if not x in stopwords_eng]

    # # Combine words into a paragraph again
    # useful_words_string = " ".join(useful_words)
    # return useful_words_string
    spl = raw_doc.split(".")
    ind = int(spl[0])
    if ind in FRAGMENT_INDICES_TO_IGNORE:
        return None
    return {
        "ind": ind,
        "text": "".join(spl[1:len(spl)]).strip().replace("\n", ". ")
    }

for i, d in enumerate(document_list):
    cleaned = clean_doc(d)
    if cleaned:
        clean_document_list.append(cleaned)

# Now renumber for ignored fragments
for i, d in enumerate(clean_document_list):
    if clean_document_list[i]["ind"] >= 514:
        clean_document_list[i]["ind"] = clean_document_list[i]["ind"]-1

json_formatted_str = json.dumps(clean_document_list, indent=2)
# print(json_formatted_str)
for ii in [513, 514, 515, 923]:
    json_formatted_str = json.dumps(get_fragment_by_ind(clean_document_list, ii), indent=2)
    print(json_formatted_str)