use enigo::{Axis::Vertical, Coordinate::Rel, Enigo, Keyboard, Mouse, Settings};

#[tauri::command]
fn trigger_key(key: &str) {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    println!("Key: {key}");

    enigo.text(key).unwrap();
}

#[tauri::command]
fn move_mouse(x: i32, y: i32) {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo.move_mouse(x, y, Rel).unwrap();
}

#[tauri::command]
fn scroll() {
    let mut enigo = Enigo::new(&Settings::default()).unwrap();
    enigo.scroll(1, Vertical).unwrap();
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
        .invoke_handler(tauri::generate_handler![trigger_key, scroll, move_mouse])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
