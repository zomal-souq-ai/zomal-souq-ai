// تشغيل واجهة زمل سوق AI
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app') || document.body;
  
  app.innerHTML = `
    <div style="min-height: 100vh; background-color: #f9fafb; display: flex; flex-direction: column; align-items: center; padding: 16px; font-family: Tahoma, sans-serif;">
      
      <!-- الهيدر العلوي -->
      <div style="width: 100%; max-width: 400px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <span style="font-size: 20px; font-weight: bold; color: #1f2937;">زمل سوق AI</span>
        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #dbeafe; display: flex; align-items: center; justify-content: center; font-size: 20px;">🤖</div>
      </div>

      <!-- البطاقة الزرقاء الرئيسية -->
      <div style="width: 100%; max-width: 400px; background: linear-gradient(to bottom, #1e3a8a, #1d4ed8); border-radius: 24px; padding: 24px; color: white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); margin-bottom: 24px; text-align: center;">
        <div style="display: inline-block; background-color: rgba(30, 64, 175, 0.6); padding: 4px 16px; border-radius: 9999px; font-size: 12px; margin-bottom: 16px; color: #bfdbfe;">
          التسوق أصبح أذكى
        </div>
        
        <h1 style="font-size: 28px; font-weight: 850; margin-bottom: 12px; line-height: 1.2;">
          كل المتاجر في مكان واحد
        </h1>
        
        <p style="font-size: 14px; color: #dbeafe; margin-bottom: 24px; line-height: 1.5;">
          قل لنا ماذا تريد، واستكشف المنتجات والمتاجر من خلال تجربة تسوق ذكية وسهلة في زمل سوق AI.
        </p>

        <!-- صندوق البحث -->
        <div style="background: white; border-radius: 16px; padding: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 8px;">
          <input 
            type="text" 
            placeholder="مثال: عطر، سماعة، حذاء، أو هدية" 
            style="width: 100%; padding: 10px 14px; font-size: 14px; border: none; outline: none; background: transparent; color: #374151; text-align: right;"
          />
          <button 
            style="width: 100%; background-color: #10b981; color: white; font-weight: bold; padding: 12px; border-radius: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px;"
          >
            <span>✨ اسأل AI</span>
          </button>
        </div>
      </div>

    </div>
  `;
});
