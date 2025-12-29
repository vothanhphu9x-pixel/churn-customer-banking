import re
import json

def extract_schema(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Tìm các section 5.x (Data Dictionary & Feature Sections)
    sections = re.split(r'\n##\s+5\.\d+\s+', content)
    if len(sections) <= 1:
        # Thử tìm theo cấu trúc khác nếu không khớp
        sections = re.split(r'\n###?\s+\d+\.\d+\s+', content)

    data_dictionary = {}

    for section in sections[1:]:
        lines = section.split('\n')
        table_name = lines[0].strip()
        
        # Tìm bảng markdown trong section
        table_match = re.search(r'\|.*?\|.*?\n\|[-: |]*\|\n(\|.*?\|.*?\n)+', section, re.DOTALL)
        columns = []
        if table_match:
            table_text = table_match.group(0)
            rows = table_text.strip().split('\n')
            headers = [h.strip() for h in rows[0].split('|')[1:-1]]
            for row in rows[2:]:
                values = [v.strip() for v in row.split('|')[1:-1]]
                if len(values) >= len(headers):
                    col_data = dict(zip(headers, values))
                    columns.append(col_data)
        
        # Tìm chi tiết từng trường (#### field_name)
        field_details = re.findall(r'####\s+`?(\w+)`?\n\n- Kiểu dữ liệu:\s*(.*?)\n- Mô tả:\s*(.*?)\n(?:- Ví dụ:\s*(.*?)\n)?- Null Policy:\s*(.*?)\n- Ý nghĩa nghiệp vụ:\s*(.*?)(?=\n\n|\n---|####|$)', section, re.DOTALL)
        
        detailed_columns = {}
        for field in field_details:
            name, dtype, desc, example, null_policy, biz_meaning = field
            detailed_columns[name] = {
                "DataType": dtype.strip(),
                "Description": desc.strip(),
                "Example": example.strip() if example else "",
                "NullPolicy": null_policy.strip(),
                "BusinessMeaning": biz_meaning.strip()
            }

        # Kết hợp thông tin từ bảng và chi tiết
        final_columns = []
        if columns:
            for col in columns:
                name = col.get('Feature') or col.get('Trường') or col.get('Name')
                if name and name in detailed_columns:
                    col.update(detailed_columns[name])
                final_columns.append(col)
        else:
            for name, info in detailed_columns.items():
                info['Name'] = name
                final_columns.append(info)

        data_dictionary[table_name] = {
            "description": lines[2] if len(lines) > 2 else "",
            "columns": final_columns
        }

    return data_dictionary

if __name__ == "__main__":
    schema = extract_schema('/home/ubuntu/upload/README.md')
    with open('/home/ubuntu/schema.json', 'w', encoding='utf-8') as f:
        json.dump(schema, f, ensure_ascii=False, indent=2)
    print("Schema extracted to /home/ubuntu/schema.json")
