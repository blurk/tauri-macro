use enigo::{
    Direction::{Click, Press, Release},
    Enigo, Key, Keyboard, Settings,
};

#[tauri::command]
fn trigger_key(key: &str) {
    let value = key.chars().next().unwrap();
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    let check_is_uppercase = value.is_ascii_uppercase();
    let unicode = Key::Unicode(key.to_lowercase().chars().next().unwrap());
    let special_chars = "{}|:\"<>?!@#$%^&*()_+";
    let check_is_special_char = special_chars.contains(value);

    println!("Key: {key}, Value: {value}, check_is_uppercase: {check_is_uppercase}, check_is_special_char: {check_is_special_char}");

    if check_is_uppercase {
        enigo.key(Key::Shift, Press).unwrap();
        enigo.key(unicode, Click).unwrap();
        enigo.key(Key::Shift, Release).unwrap();
    } else if check_is_special_char {
        let _key = match value {
            '!' => Key::Num1,
            '@' => Key::Num2,
            '#' => Key::Num3,
            '$' => Key::Num4,
            '%' => Key::Num5,
            '^' => Key::Num6,
            '&' => Key::Num7,
            '*' => Key::Num8,
            '(' => Key::Num9,
            ')' => Key::Num0,
            '_' => Key::Other(189),
            '+' => Key::Other(187),
            '{' => Key::Other(219),
            '}' => Key::Other(221),
            '|' => Key::Other(226),
            ':' => Key::Other(186),
            '"' => Key::Other(222),
            '<' => Key::Other(188),
            '>' => Key::Other(190),
            '?' => Key::Other(220),
            _ => Key::Space,
        };

        enigo.key(Key::Shift, Press).unwrap();
        enigo.key(_key, Click).unwrap();
        enigo.key(Key::Shift, Release).unwrap();
    } else {
        enigo.key(unicode, Click).unwrap();
    }
}

#[tauri::command]
fn trigger_delete_all() {
    println!("Select all and delete");

    let mut enigo = Enigo::new(&Settings::default()).unwrap();

    enigo.key(Key::Control, Press).unwrap();
    enigo.key(Key::Unicode('a'), Click).unwrap();
    enigo.key(Key::Backspace, Click).unwrap();
    enigo.key(Key::Control, Release).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                let _ = app.handle().plugin(tauri_plugin_positioner::init());
                tauri::tray::TrayIconBuilder::new()
                    .on_tray_icon_event(|tray_handle, event| {
                        tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);
                    })
                    .build(app)?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![trigger_key, trigger_delete_all])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
