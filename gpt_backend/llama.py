from transformers import LlamaTokenizer, AutoModelForCausalLM, AutoTokenizer

tokenizer = LlamaTokenizer.from_pretrained("cutycat2000x/MeowGPT-3.5")
model = AutoModelForCausalLM.from_pretrained("cutycat2000x/MeowGPT-3.5")
